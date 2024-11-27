import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import ModuleConstant "../constant_backend/constant";
actor Authentication {

  public type Users = {
    id : Text;
    role : ?Text;
    userName : Text;

  };

  private stable var listUserEntries : [(Principal, Users)] = [];

  private var listUsers = HashMap.HashMap<Principal, Users>(1, Principal.equal, Principal.hash);

  public func addUser(userIdentity : Principal, userName : Text) : async Text {
    let user = userIdentity;

    // Check if the caller ID is valid (non-empty in this context)
    if (Principal.isAnonymous(user)) {
      throw Error.reject("Anonymous principal not allowed");
    };
    let dataUser = {
      id = Principal.toText(userIdentity);
      role = null;
      userName = userName;
    };
    Debug.print(debug_show (dataUser));
    listUsers.put(user, dataUser);

    return ModuleConstant.SUCCESS_ADD_USER;
  };

  public query func getUser(userIdentity : Principal) : async (Text, ?Users) {
    let user = userIdentity;

    switch (listUsers.get(user)) {
      case (?userData) {
        return (ModuleConstant.USER_FOUND, ?userData);
      };
      case null {
        return ("", null);
      };
    };
  };

  public func setRoleUser(userIdentity : Principal, role : Text) : async Text {

    switch (listUsers.get(userIdentity)) {
      case null {
        return ModuleConstant.USER_NOT_FOUND;
      };
      case (?user) {
        listUsers.put(userIdentity, { user with role = ?role });
        return ModuleConstant.SUCCESS_SET_ROLE_USER;
      };
    };
  };

  system func preupgrade() {
    listUserEntries := Iter.toArray(listUsers.entries());
    Debug.print(debug_show (listUserEntries));
  };

  system func postupgrade() {

    listUsers := HashMap.fromIter<Principal, Users>(listUserEntries.vals(), 1, Principal.equal, Principal.hash);
  };

};
