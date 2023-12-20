pragma solidity ^0.5.17;

import "./interfaces/IStakingRewards.sol";

import "./libraries/SafeERC20.sol";
import "./libraries/SafeMath.sol";
import "./libraries/Math.sol";
import "./ERC20Detailed.sol";

import "./RewardsDistributionRecipient.sol";
import "./ReentrancyGuard.sol";
/**
 * @title 用户质押流动性，质押合约定期分发奖励ATP给用户
 *
 */
contract StakingRewards is IStakingRewards, RewardsDistributionRecipient, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */
    //奖励token
    IERC20 public rewardsToken;
    //质押token（UniswapV2ERC20）
    IERC20 public stakingToken;
    //质押周期结束时间
    uint256 public periodFinish = 0;
    //奖励比率（总奖励金额/奖励持续时间）
    uint256 public rewardRate = 0;
    //奖励活动周期
    uint256 public rewardsDuration = 30 days;
    //最后分发奖励时间
    uint256 public lastUpdateTime;
    //奖励每个token
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _rewardsDistribution,
        address _rewardsToken,
        address _stakingToken
    ) public {
        rewardsToken = IERC20(_rewardsToken);
        stakingToken = IERC20(_stakingToken);
        rewardsDistribution = _rewardsDistribution;
    }

    /* ========== VIEWS ========== */
    /**
     * @dev 总质押流动性量
     */
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev 查询指定账户余额
     * @param account 查询指定账户余额
     */
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev 奖励可以发放截止时间，如果未超过截止时间，取当前时间，否则取截止时间
     */
    function lastTimeRewardApplicable() public view returns (uint256) {
        //底层链时间戳是毫秒要转成秒
        return Math.min(block.timestamp.div(1000), periodFinish);
    }

    /**
     * @dev 每个质押token分配奖励
     */
    function rewardPerToken() public view returns (uint256) {
        // 如果当前总质押量为0，直接返回之前的每个token保存的质押奖励数额
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        //每个token已经分配的奖励+（最晚可分配奖励时间-上次分配奖励时间）x 奖励利率  / 总的质押token数量
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable().sub(lastUpdateTime).mul(rewardRate).mul(1e18).div(_totalSupply)
            );
    }

    /**
    * @dev 查询指定账户一共赚到多少钱
    * @param account 查询指定账户赚的代币量
    */
    function earned(address account) public view returns (uint256) {
        return _balances[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]);
    }

    /**
     * @dev 查看当前周期已持序的时间内已段需要发放奖励数量
     */
    function getRewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsDuration);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */
    /**
     * @dev 带签名的质押交易
     * @param amount 赎回奖励金额
     * @param deadline 质押期限
     * @param v signature v value
     * @param r signature.r
     * @param s signature.r
     */
    function stakeWithPermit(uint256 amount, uint deadline, uint8 v, bytes32 r, bytes32 s) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        _totalSupply = _totalSupply.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);

        // permit
        IUniswapV2ERC20(address(stakingToken)).permit(msg.sender, address(this), amount, deadline, v, r, s);

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev 用户质押token
     * @param amount 质押金额
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        _totalSupply = _totalSupply.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev 用户赎回质押token
     * @param amount 赎回奖励金额
     */
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev 用户取出自己质押奖励
     */
    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    /**
     * @dev 赎回质押token，并取走奖励
     */
    function exit() external {
        withdraw(_balances[msg.sender]);
        getReward();
    }

    /* ========== RESTRICTED FUNCTIONS ========== */
    /**
     * @dev 给奖励池添加金额
     */
    function notifyRewardAmount(uint256 reward) external onlyRewardsDistribution updateReward(address(uint160(0))) {
        if (block.timestamp.div(1000) >= periodFinish) {
            rewardRate = reward.div(rewardsDuration);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp.div(1000));
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(rewardsDuration);
        }

        // Ensure the provided reward amount is not more than the balance in the contract.
        // This keeps the reward rate in the right range, preventing overflows due to
        // very high values of rewardRate in the earned and rewardsPerToken functions;
        // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint balance = rewardsToken.balanceOf(address(this));
        require(rewardRate <= balance.div(rewardsDuration), "Provided reward too high");

        lastUpdateTime = block.timestamp.div(1000);
        periodFinish = block.timestamp.div(1000).add(rewardsDuration);
        emit RewardAdded(reward);
    }

    /* ========== MODIFIERS ========== */
    /**
     * @dev 更新指定账号奖励金额
     * @param account 账号
     */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(uint160(0))) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /* ========== EVENTS ========== */
    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
}

interface IUniswapV2ERC20 {
    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
}
