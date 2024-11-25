import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
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

    };
    private stable var listProjectStable : [(Text, Project)] = [];

    var listProject = HashMap.HashMap<Text, Project>(1, Text.equal, Text.hash);

    // function to add project
    public shared func addProject(project : Project) : async Text {
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
    public query func getProjects() : async {
        readyToDeploy : [Project];
        open : [Project];
        inProgress : [Project];
    } {
        // Initialize the result map with explicit types
        var result = {
            var readyToDeploy : [Project] = [];
            var open : [Project] = [];
            var inProgress : [Project] = [];
        };

        // Iterate through the HashMap and group by status
        for ((_, project) in listProject.entries()) {
            switch (project.status) {
                case ("readyToDeploy") {
                    result.readyToDeploy := Array.append<Project>(result.readyToDeploy, [project]);
                };
                case ("open") {
                    result.open := Array.append<Project>(result.open, [project]);
                };
                case ("inProgress") {
                    result.inProgress := Array.append<Project>(result.inProgress, [project]);
                };
                case (_) {}; // Do nothing for other status
            };
        };

        // Return the grouped data (fields automatically converted back to immutable)
        return {
            readyToDeploy = result.readyToDeploy;
            open = result.open;
            inProgress = result.inProgress;
        };
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
    };

    system func postupgrade() {
        listProject := HashMap.fromIter<Text, Project>(listProjectStable.vals(), 1, Text.equal, Text.hash);
    };

};
