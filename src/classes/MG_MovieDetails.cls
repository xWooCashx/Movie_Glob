

public class MG_MovieDetails {

    public class Production_companies {
        public Integer id;
        public String logo_path;
        public String name;
        public String origin_country;
    }

    public class Production_countries {
        public String iso_3166_1;
        public String name;
    }

    public class Belongs_to_collection {
        public Integer id;
        public String name;
        public String poster_path;
        public String backdrop_path;
    }

    public Boolean adult;
    @AuraEnabled
    public String backdrop_path;
    public Belongs_to_collection belongs_to_collection;
    @AuraEnabled
    public Integer budget;
    @AuraEnabled
    public List<Genres> genres;
    @AuraEnabled
    public String homepage;
    @AuraEnabled
    public String id;
    public String imdb_id;
    public String original_language;
    public String original_title;
    @AuraEnabled
    public String overview;
    @AuraEnabled
    public Double popularity;
    @AuraEnabled
    public String poster_path;
    public List<Production_companies> production_companies;
    public List<Production_countries> production_countries;
    @AuraEnabled
    public String release_date;
    @AuraEnabled
    public String revenue;
    @AuraEnabled
    public Integer runtime;
    public List<Spoken_languages> spoken_languages;
    public String status;
    @AuraEnabled
    public String tagline;
    @AuraEnabled
    public String title;
    @AuraEnabled
    public Boolean video;
    @AuraEnabled
    public Double vote_average;
    @AuraEnabled
    public Integer vote_count;
    @AuraEnabled
    public Boolean fromDB=false;
    @AuraEnabled
    public Boolean isFavourite=false;
    @AuraEnabled
    public Boolean isBlackListed=false;
    @AuraEnabled
    public Boolean isReviewed=false;

    public class Genres {
        @AuraEnabled
        public Integer id;
        @AuraEnabled
        public String name;
        public Genres(Integer id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    public class Spoken_languages {
        public String iso_639_1;
        public String name;
    }

    public static MG_MovieDetails toMovie(MG_Movie__c movie) {
        MG_MovieDetails res = new MG_MovieDetails();
        res.id = movie.Id;
        res.title = movie.Title__c;
        res.backdrop_path = movie.Backdrop_Path__c;
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
        res.budget = (Integer) movie.Budget__c;
        res.homepage = movie.Homepage__c;
        res.revenue = String.valueOf(movie.Revenue__c);
        if(movie.RuntimeRuntime__c!=null){
            res.runtime = (Integer) movie.RuntimeRuntime__c;
        }
        res.genres = new List<MG_MovieDetails.Genres>();
        if(!String.isEmpty(movie.Genres__c)) {
            List<String> genres = movie.Genres__c.split(';');
            for (String gen : genres) {
                res.genres.add(new Genres(0, gen));
            }
        }
        if (!String.isEmpty(String.valueOf(movie.Release_Date__c))) {
            res.release_date = String.valueOf(movie.Release_Date__c);
        }
        if (!String.isEmpty(movie.Popularity__c)) {
            res.popularity = Double.valueOf(movie.Popularity__c);
        }
        res.fromDB = true;

        System.debug('movie parsed : ' + res);
        return res;
    }

    public static MG_MovieDetails parse(String json) {
        return (MG_MovieDetails) System.JSON.deserialize(json, MG_MovieDetails.class);
    }
}