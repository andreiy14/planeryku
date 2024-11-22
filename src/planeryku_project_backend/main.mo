import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Principal "mo:base/Principal";

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
        listProject.put(project.id, project);
        return "Success";
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

    system func preupgrade() {
        listProjectStable := Iter.toArray(listProject.entries());
    };

    system func postupgrade() {
        listProject := HashMap.fromIter<Text, Project>(listProjectStable.vals(), 1, Text.equal, Text.hash);
    };

};
