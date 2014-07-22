upsert_successful_projs = function() {
                Meteor.http.call(
                "GET",
                "https://www.kickstarter.com/discover/advanced",
                {
                headers:{
                    "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36",
                },
                params:{
                    format:'json',
                    state:'successful',
                    sort:'launch_date',
                    page:1
                }
                },
                function(error, result){upsert_projs(result.data.projects)}
            );
            
        }

upsert_projs = function (projects) {
    projects.forEach(
        function(proj){
            console.log(proj.id);
            Projects.upsert({id:proj.id},proj);
        }
    )
    
}
        
Meteor.methods(
    {
        upsert_successful_projs: upsert_successful_projs
    }
)