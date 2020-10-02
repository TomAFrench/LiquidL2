

contract WithdrawalVaultFactory {

  // The WithdrawalVaultFactory 
  mapping(address => address) public collateralVaults 

  constructor (address _aaveCollateralVaultProxy) {
    // set aaveCollateralProxy
  }

  function depositCollateral(address asset, uint amount) onlyOwner {
    // address collateralVault = collateralVaults[asset]
    // transferFrom(msg.sender, address(this), amount)
    // collateralVault.deposit(amount)
  }

  function giveLoan(address borrower, address asset, uint amount) {

    // create2 a vault from borrower and asset if doesn't exist

    // increase the credit limit of this address by amount

  }

  function withdrawFromVault(address asset, uint amount) {

    // create2 a vault from msg.sender and asset if doesn't exist

    // call withdraw on vault and send funds to msg.sender

  }

  function repayLoan(address borrower, address asset, bytes withdrawalProof) {

    // get vault address from borrower and asset if doesn't exist

    // submit withdrawalProof so that funds get credited to vault

    // call repay on vault to free up credit limit

  }

}