// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {
   address payable public myAccount = payable(0x923B5A59Ea9C7A41eC079203Cd2D43454b2548Eb);

    function transferToMyAccount(uint256 amount) external {
        require(msg.sender == owner(), "Only the contract owner can transfer funds.");
        myAccount.transfer(amount);
    }
    
    // Sözleşme sahibini döndüren bir fonksiyon
    function owner() internal view returns (address) {
        return msg.sender;
    }
  
  struct Access{
     address user; 
     bool access; //true or false
  }
  mapping(address=>string[]) value;//to store the url
  mapping(address=>mapping(address=>bool)) ownership;
  mapping(address=>Access[]) accessList;//to give the access
  mapping(address=>mapping(address=>bool)) previousData;

  function add(address _user,string memory url) external {
      value[_user].push(url);
  }
  function allow(address user) external {//def
      ownership[msg.sender][user]=true; 
      if(previousData[msg.sender][user]){
         for(uint i=0;i<accessList[msg.sender].length;i++){
             if(accessList[msg.sender][i].user==user){
                  accessList[msg.sender][i].access=true; 
             }
         }
      }else{
          accessList[msg.sender].push(Access(user,true));  
          previousData[msg.sender][user]=true;  
      }
    
  }
  function disallow(address user) public{
      ownership[msg.sender][user]=false;
      for(uint i=0;i<accessList[msg.sender].length;i++){
          if(accessList[msg.sender][i].user==user){ 
              accessList[msg.sender][i].access=false;  
          }
      }
  }

  function display(address _user) external view returns(string[] memory){
      (_user==msg.sender || ownership[_user][msg.sender],"You don't have access");
      return value[_user];
  }

  function shareAccess() public view returns(Access[] memory){
      return accessList[msg.sender];
  }
  function download(address _user) external view returns (string[] memory) {
    require(_user == msg.sender || ownership[_user][msg.sender], "You don't have access to download");
    return value[_user];
  }
  function deleteFile(uint256 index) external {
    require(index < value[msg.sender].length, "Index out of bounds");
    // Dosyanın sahibi mi kontrol edelim
    require(msg.sender == owner() || msg.sender == accessList[msg.sender][index].user, "You don't have permission to delete this file");

    // Silme işlemi
    for (uint256 i = index; i < value[msg.sender].length - 1; i++) {
        value[msg.sender][i] = value[msg.sender][i + 1];
    }
    value[msg.sender].pop();
}

}