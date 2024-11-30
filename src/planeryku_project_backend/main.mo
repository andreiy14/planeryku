import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Source "mo:uuid/async/SourceV4";
import UUID "mo:uuid/UUID";
import ModuleConstant "../constant_backend/constant";

actor Projects {

    public type Project = {
        id : Text;
        name : Text;
        status : Text;
        description : Text;
        startDate : Text;
        endDate : Text;
        listStatus : [Text]
;

    };

   
    private stable var listProjectStable : [(Text, Project)] = [];

    var listProject = HashMap.HashMap<Text, Project>(1, Text.equal, Text.hash);

    // function to add project
    public func addProject(project : Project) : async Text {
        try {
            let source = Source.Source();
            let uuid = UUID.toText(await source.new());
  
            let newProject = {
                id = uuid;
                name = project.name;
                status = project.status;
                description = project.description;
                startDate = project.startDate;
                endDate = project.endDate;
                listStatus = project.listStatus;
            };

            listProject.put(uuid, newProject);

            return ModuleConstant.ADD_PROJECT_SUCCESS # uuid;

        } catch (e) {
            return throw e;
        };

    };

    // Query function for detail project
    public query func getDetailProject(projectId : Text) : async ?Project {

        if (listProject.get(projectId) == null) {
            return null;
        };

        return listProject.get(projectId);
    };

    // Query function to map and return data by status
    public query func getProjects() : async [Project] {

      

        return Iter.toArray(listProject.vals());
    };

    // func to update  project
    public shared func updateProject(project : Project) : async Text {
        let id = project.id;
        switch (listProject.get(id)) {
            case null {
                return ModuleConstant.ERROR_MESSAGE_NOT_FOUND_ID;
            };
            case (?_) {
                listProject.put(id, project);
                return ModuleConstant.UPDATE_PROJECT_SUCCESS;
            };
        };

    };

    // func to change status project
    public shared func updateStatusProject(projectId : Text, status : Text) : async Text {
        switch (listProject.get(projectId)) {
            case null return ModuleConstant.ERROR_MESSAGE_NOT_FOUND_ID;
            case (?project) {
                listProject.put(projectId, { project with status = status });
                return ModuleConstant.UPDATE_STATUS_PROJECT_SUCCESS;
            };
        };
    };

    system func preupgrade() {
        listProjectStable := Iter.toArray(listProject.entries());
        // listProjectStable := []
    };

    system func postupgrade() {
        listProject := HashMap.fromIter<Text, Project>(listProjectStable.vals(), 1, Text.equal, Text.hash);
        // listProject := HashMap.HashMap<Text, Project>(1, Text.equal, Text.hash);
    };

};
