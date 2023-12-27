const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const Votedeadline = 1703903235;
describe("Voting", function () {
  beforeEach(async function () {
    const Voting = await ethers.getContractFactory("Voting");
    this.voting = await Voting.deploy();
  });
  it("should give error if deadline is already set", async function () {
    const deadline = await this.voting.setVoteDeadline(Votedeadline);
    await expect(this.voting.setVoteDeadline(Votedeadline)).to.be.revertedWith(
      "Vote deadline already set"
    );
  });

  it("set deadline", async function () {
    const Setdeadline = await this.voting.setVoteDeadline(Votedeadline);
    const deadline = await this.voting.getVoteDeadline();
    expect(deadline).to.equal(Votedeadline);
  });

  it("add candidate", async function () {
    const deadline = await this.voting.setVoteDeadline(Votedeadline);
    const tx = await this.voting.addCandidate("candidate1", "Party1");
    await expect(tx).to.emit(this.voting, "candidateRegistered").withArgs(0);
  });

  // it should give error if voting deadline is not set

  it("should give error if voting deadline is not set", async function () {
    await expect(
      this.voting.addCandidate("candidate1", "Party1")
    ).to.be.revertedWith("Voting deadline has passed or not set");
  });

  it("vote", async function () {
    const deadline = await this.voting.setVoteDeadline(Votedeadline);
    const addCandidate = await this.voting.addCandidate("candidate1", "Party1");
    const tx1 = await this.voting.vote("candidate1", 0);
    await expect(tx1).to.emit(this.voting, "voteRegistered").withArgs(0, 0);
  });

  it("should give error if voting deadline is passed", async function () {
    const deadline = await this.voting.setVoteDeadline(1);
    await expect(this.voting.vote("candidate1", 0)).to.be.revertedWith(
      "Voting deadline has passed"
    );
  });
  it("should be executed without error", async function () {
    const deadline = await this.voting.setVoteDeadline(Votedeadline);
    const tx1 = await this.voting.vote("candidate1", 0);
  });

  it("get winner", async function () {
    const deadline = await this.voting.setVoteDeadline(Votedeadline);
    const addCandidate = await this.voting.addCandidate("candidate1", "Party1");
    const tx1 = await this.voting.vote("candidate1", 0);
    const winner = await this.voting.getWinner();
    expect(winner).to.equal("candidate1");
  });

  it("execute with multiple candidates and votes", async function () {
    const deadline = await this.voting.setVoteDeadline(Votedeadline);
    const addCandidate = await this.voting.addCandidate("candidate1", "Party1");
    const addCandidate2 = await this.voting.addCandidate(
      "candidate2",
      "Party2"
    );
    const tx1 = await this.voting.vote("candidate1", 0);
    const tx2 = await this.voting.vote("candidate2", 1);
    const tx3 = await this.voting.vote("candidate2", 1);
    const winner = await this.voting.getWinner();
    expect(winner).to.equal("candidate2");
  });
});
