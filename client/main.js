Template.search.events({
    'keyup input.search-query': function (evt) {
        Session.set("search-query", evt.currentTarget.value);
    },
    'click .delivered' : function(evt, tmpl){
        Projects.update(this._id,{$inc:{delivered_count:1}})
    },
    'click .failed' : function(evt, tmpl){
        Projects.update(this._id,{$inc:{failed_count:1}})
    }    
})

Template.search.helpers({
    'results' : function(){
        console.log(Session.get("search-query"));
        var query = Session.get("search-query");
        res = Projects.find({$or: [{'name': new RegExp(query)},
                                    {'blurb': new RegExp(query)}]});
        return res;
    }
})