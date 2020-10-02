

contract WithdrawalVault {

  address public borrower;
  address public asset;

  constructor (address borrower, address asset) {
  }

  function repayLoan(address asset, uint amount) {

    // create2 a vault from msg.sender and asset if doesn't exist

    // call withdraw on vault and send funds to msg.sender

  }

  function claimL2Funds(bytes withdrawalProof) {

    // get vault address from borrower and asset if doesn't exist

    // submit withdrawalProof so that funds get credited to vault

    // call repay on vault to free up credit limit

  }

}