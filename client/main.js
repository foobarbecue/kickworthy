Template.ks_un_form.helpers({
    'backed' : function(){
        if (Meteor.user()){
            return $(Meteor.user().profile.ks_backed.content).find('h4 a').text();
        }
    }
})

Template.ks_un_form.events({
    'click button' : function(){
        Meteor.call('add_ks_un',$('#ks_un_input').val());
        Meteor.call('add_user_backed');
    },
    'click .toggle_help' : function(){
        $('#ks_un_help').slideToggle();
    }
})

Template.search.events({
    'keyup input.search-query': function (evt) {
        Session.set("search-query", evt.currentTarget.value);
    },
    'click .delivered' : function(evt, tmpl){
        var votesuser = {};
        votesuser[('votes.'+Meteor.userId())+'.delivered'] = true
        votesuser[('votes.'+Meteor.userId())+'.date'] = new Date()
        Projects.update(this._id,{$set:votesuser});
    },
    'click .failed' : function(evt, tmpl){
        var votesuser = {};
        votesuser[('votes.'+Meteor.userId())+'.delivered'] = false
        votesuser[('votes.'+Meteor.userId())+'.date'] = new Date()
        Projects.update(this._id,{$set:votesuser});
    },
    'input .proj_comments' : function(evt, tmpl){
        var usr_vote_note = {};
        usr_vote_note['votes.'+Meteor.userId()+'.note']=evt.currentTarget.textContent
        Projects.update({_id:this._id},{$set:usr_vote_note})
    }
})

Template.search.helpers({
    'results' : function(){
        console.log(Session.get("search-query"));
        var query = Session.get("search-query");
        if ($('input[name=backed_filter]:checked').val()==='all'){
            return Projects.find({$or: [{'name': new RegExp(query)},
                                        {'blurb': new RegExp(query)}]});
        }else{
            if (Meteor.user()){
            // TODO rewrite for readability
            return Projects.find({$and:[{'urls.web.project':{$in:Meteor.user().profile.ks_backed}}, {'blurb':new RegExp(query)}]}).fetch()
            }
        }
    },
    'current_user_voted_delivered' : function(){
        var project = this;
        var userId = Meteor.userId()
        if (project.hasOwnProperty('votes')){
            if (project.votes.hasOwnProperty(userId) && project.votes[userId].delivered==true){
                return 'highlight'
            }
        }
    },
    'current_user_voted_failed' : function(){
        var project = this;
        var userId = Meteor.userId()        
        if (project.hasOwnProperty('votes')){
            if (project.votes.hasOwnProperty(userId) && project.votes[userId].delivered==false){
                return 'highlight'
            }
        }   
    },

    'delivered_count' : function(){
        var vote_count = 0
        var project = this
        // Looping through all projects for all users -- very very bad!
        // Need to use database's aggregation but it's not implemented by meteor yet.
        if (project.hasOwnProperty('votes')){
            Meteor.users.find().forEach(function(usr){
                if (project.votes.hasOwnProperty(usr._id) && project.votes[usr._id].delivered==true){
                    vote_count++;
                }
            })
            return vote_count;
        }else{
            return 0;
        }
    },
    'failed_count' : function(){
        var vote_count = 0
        var project = this
        // Looping through all projects for all users -- very very bad!
        // See delivered_count, should probably factor out common
        if (project.hasOwnProperty('votes')){
            Meteor.users.find().forEach(function(usr){
                if (project.votes.hasOwnProperty(usr._id) && project.votes[usr._id].delivered==false){
                    vote_count++;
                }
            })
            return vote_count;
        }else{
            return 0;
        }
    },
})

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});
