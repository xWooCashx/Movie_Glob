/**
 * Created by BRITENET on 02.09.2019.
 */

public with sharing class MG_PeopleResults {

    public class Known_for {
        public String poster_path;
        public Boolean adult;
        public String overview;
        public String release_date;
        public String original_title;
        public List<Integer> genre_ids;
        @AuraEnabled
        public Integer id;
        public String media_type;
        public String original_language;
        @AuraEnabled
        public String title;
        public String backdrop_path;
        public Double popularity;
        public Integer vote_count;
        public Boolean video;
        public Double vote_average;
    }

    public class Known_for_X {
        public String poster_path;
        public Boolean adult;
        public String overview;
        public String release_date;
        public String original_title;
        public List<Integer> genre_ids;
        @AuraEnabled
        public Integer id;
        public String media_type;
        public String original_language;
        @AuraEnabled
        public String title;
        public Object backdrop_path;
        public Double popularity;
        public Integer vote_count;
        public Boolean video;
        public Integer vote_average;
    }

    public class Results {
        @AuraEnabled
        public String profile_path;
        @AuraEnabled
        public Boolean adult;
        @AuraEnabled
        public Integer id;
        @AuraEnabled
        public List<Known_for> known_for;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public Double popularity;
    }

    public class Known_for_Y {
        public String poster_path;
        public Boolean adult;
        public String overview;
        public String release_date;
        public String original_title;
        public List<Integer> genre_ids;
        public Integer id;
        public String media_type;
        public String original_language;
        @AuraEnabled
        public String title;
        public String backdrop_path;
        public Double popularity;
        public Integer vote_count;
        public Boolean video;
        public Integer vote_average;
    }

    public class Known_for_W {
        public String poster_path;
        public Boolean adult;
        public String overview;
        public String release_date;
        public String original_title;
        public List<Genre_ids> genre_ids;
        @AuraEnabled
        public Integer id;
        public String media_type;
        public String original_language;
        @AuraEnabled
        public String title;
        public String backdrop_path;
        public Double popularity;
        public Integer vote_count;
        public Boolean video;
        public Integer vote_average;
    }

    public class Known_for_Z {
        public String poster_path;
        public Double popularity;
        @AuraEnabled
        public Integer id;
        public String overview;
        public String backdrop_path;
        public Double vote_average;
        public String media_type;
        public String first_air_date;
        public List<String> origin_country;
        public List<Integer> genre_ids;
        public String original_language;
        public Integer vote_count;
        @AuraEnabled
        public String name;
        public String original_name;
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


    public static MG_PeopleResults parse(String json) {
        return (MG_PeopleResults) System.JSON.deserialize(json, MG_PeopleResults.class);
    }
}