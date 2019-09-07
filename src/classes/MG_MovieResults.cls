/**
 * Created by BRITENET on 02.09.2019.
 */

public with sharing class MG_MovieResults {
    public class Results {
        @AuraEnabled
        public String poster_path;
        @AuraEnabled
        public Boolean adult;
        @AuraEnabled
        public String overview;
        @AuraEnabled
        public String release_date;
        @AuraEnabled
        public List<Integer> genre_ids;
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String original_title;
        @AuraEnabled
        public String original_language;
        @AuraEnabled
        public String title;
        @AuraEnabled
        public String backdrop_path;
        @AuraEnabled
        public Double popularity;
        @AuraEnabled
        public Integer vote_count;
        @AuraEnabled
        public Boolean video;
        @AuraEnabled
        public Double vote_average;
        @AuraEnabled
        public Boolean fromDB = false;
        @AuraEnabled
        public Boolean isFavourite = false;
        @AuraEnabled
        public Boolean isBlackListed = false;
        @AuraEnabled
        public Boolean isReviewed=false;
    }
    @AuraEnabled
    public Integer page;
    @AuraEnabled
    public List<Results> results;
    @AuraEnabled
    public Integer total_results;
    @AuraEnabled
    public Integer total_pages;

    public class Genre_ids {
    }
    public static MG_MovieResults.Results toMovie(MG_Movie__c movie) {
        MG_MovieResults.Results res = new MG_MovieResults.Results();
        res.id = movie.Id;
        res.title = movie.Title__c;
        res.backdrop_path = movie.Backdrop_Path__c;
//        System.debug('mov att: '+movie.Attachments.isEmpty());
//        List<Attachment> atts = [SELECT Id FROM Attachment WHERE ParentId=:movie.id];
//        if(atts.size()>0){
//            res.poster_path = atts[0].Id;
//        }
        List<ContentDocumentLink> links = [SELECT Id, ContentDocumentId From ContentDocumentLink WHERE LinkedEntityId = :movie.Id];
        if (links.size() > 0) {
            List<Id> docs = new List<Id>();
            for (ContentDocumentLink l : links) {
                docs.add(l.ContentDocumentId);
            }
            List<ContentVersion> vers = [SELECT Id FROM ContentVersion WHERE ContentDocumentId in :docs];
            if (!vers.isEmpty()) {

                res.poster_path = vers[0].Id;
            }
        }
        res.overview = movie.Overview__c;
        res.release_date = String.valueOf(movie.Release_Date__c);
        res.popularity = 100;
        res.fromDB = true;

        System.debug('movie parsed : ' + res);
        return res;
    }

    public static MG_MovieResults parse(String json) {
        return (MG_MovieResults) System.JSON.deserialize(json, MG_MovieResults.class);
    }
}
//Set<String> contentIds = new Set<String>();
//for (ContentDocument cont :[Select Id ,Title from ContentDocument WHERE ParentId=:movie.Id]) {
//contentIds.add(cont.Id);
//}
//List<ContentVersion> vers = [SELECT Id,Title FROM ContentVersion WHERE ContentDocumentId IN :contentIds];
//if(contentIds.size()>0){
//res.poster_path = vers[0].Id;
//}