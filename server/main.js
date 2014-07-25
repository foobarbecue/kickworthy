cheerio = Meteor.require('cheerio');

upsert_successful_projs = function(max_pagenum) {
    var max_pagenum = max_pagenum || 100;
    for(x=1; x < max_pagenum; x++){
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
            page:x
        }
        },
        function(error, result){
                console.log('inserting data from page ' + x)
                upsert_projs(result.data.projects)
        }
        );
    }            
}

add_ks_un = function(ks_un){
    var uid = Meteor.user()._id;
    console.log('setting ' + uid + ' to ' + ks_un)
    Meteor.users.update({_id:uid},{$set:{'profile.ks_un':ks_un}})
}

add_user_backed = function(){
    Meteor.http.call(
        "GET",
        // this only gets the first page. Need to loop through /profile/user?page=2 etc
        "https://www.kickstarter.com/profile/" + Meteor.user().profile.ks_un,
        {
            headers:{
                "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36"
        }},
        function(error, result){
            // Use cheerio (like server-side jquery) to extract project names from 
            // Kickstarter's strange backed.js private api
            var titles = cheerio.load(result.content);
            var titles = titles('a.project_item');
            
            // Remove unnecessary info before storing to DB
            var titles_clean = []
            titles.each(function(i,el){titles_clean.push(cheerio(this).attr('href'))})

            Meteor.users.update({_id:Meteor.user()._id}, {$set:{'profile.ks_backed':titles_clean}})
        }
        )
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
        upsert_successful_projs: upsert_successful_projs,
        add_user_backed: add_user_backed,
        add_ks_un: add_ks_un
    }
)