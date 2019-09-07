/**
 * Created by BRITENET on 02.09.2019.
 */

public with sharing class MG_PersonDetails {
    @AuraEnabled
    public String birthday;
    @AuraEnabled
    public String known_for_department;
    @AuraEnabled
    public String deathday;
    @AuraEnabled
    public Integer id;
    @AuraEnabled
    public String name;
    @AuraEnabled
    public List<String> also_known_as;
    @AuraEnabled
    public Integer gender;
    @AuraEnabled
    public String biography;
    @AuraEnabled
    public Double popularity;
    @AuraEnabled
    public String place_of_birth;
    @AuraEnabled
    public String profile_path;
    @AuraEnabled
    public Boolean adult;
    @AuraEnabled
    public String imdb_id;
    @AuraEnabled
    public String homepage;


    public static MG_PersonDetails parse(String json) {
        return (MG_PersonDetails) System.JSON.deserialize(json, MG_PersonDetails.class);
    }
}