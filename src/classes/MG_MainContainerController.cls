/**
 * Created by BRITENET on 02.09.2019.
 */

public with sharing class MG_MainContainerController {

    @AuraEnabled
    public static MG_MovieResults searchForMovies(String query, Integer pageNumber) {

        MG_WebserviceHandler handler = new MG_WebserviceHandler();
        MG_MovieResults res = handler.getMovies(query, pageNumber);
        System.debug('res: ' + res);
        if (res.page == res.total_pages || res.total_pages == 0) {
            List<MG_Movie__c> movies = [
                    SELECT Id, Name,Title__c, Backdrop_Path__c, Popularity__c, Poster_Path__c, Budget__c,Genres__c,Homepage__c,Overview__c,Release_Date__c,RuntimeRuntime__c,Revenue__c
                    FROM MG_Movie__c
                    WHERE Title__c LIKE :'%' + query + '%' AND Approved__c = :true
            ];
            List<MG_MovieResults.Results> readyResults = new List<MG_MovieResults.Results>();
            for (MG_Movie__c movie : movies) {
                System.debug('movie from db : ' + movie);
                res.results.add(MG_MovieResults.toMovie(movie));
                System.debug('movie from dbadded');
            }
        }

        for (MG_MovieResults.Results result : res.results) {
            List<MG_MovieReview__c> reviews = [SELECT Rating__c FROM MG_MovieReview__c WHERE Movie_Id__c = :result.id];
            result.vote_count = Integer.valueOf(reviews.size());
            Integer voteSUm = 0;
            for (MG_MovieReview__c rev : reviews) {
                voteSUm += (Integer) rev.Rating__c;
            }
            if (result.vote_count == 0) {
                result.vote_average = 0;
            } else {
                result.vote_average = voteSUm / result.vote_count;
            }
            List<MG_CollectionItem__c> items = [
                    SELECT IsBlackListed__c, IsFavourite__c
                    FROM MG_CollectionItem__c
                    WHERE Movie_Id__c = :result.id AND User__c = :UserInfo.getUserId()
                    LIMIT 1
            ];
            if (!items.isEmpty()) {
                result.isBlackListed = items.get(0).IsBlackListed__c;
                result.isFavourite = items.get(0).IsFavourite__c;
                System.debug('res in get movies' + result);
            }
            List<MG_MovieReview__c> revs = [SELECT Id FROM MG_MovieReview__c WHERE Movie_Id__c = :result.Id AND CreatedById = :UserInfo.getUserId()];
            System.debug('revs for movie : ' + revs.size());
            if (!revs.isEmpty()) {
                result.isReviewed = true;
            } else {
                result.isReviewed = false;
            }
        }
        System.debug('response size in apex : ' + res.total_results);
        return res;
    }
    @AuraEnabled
    public static MG_PeopleResults searchForPeople(String query, Integer pageNumber) {
        MG_WebserviceHandler handler = new MG_WebserviceHandler();
        MG_PeopleResults res = handler.getPeople(query, pageNumber);
        System.debug('response size in apex : ' + res.total_results);
        return res;
    }
    @AuraEnabled
    public static MG_MovieDetails getMovieDetails(String movieId) {
        MG_MovieDetails res;
        if (movieId.startsWith('a0C2')) {
            MG_Movie__c movie = [SELECT Id, Title__c, Backdrop_Path__c, Popularity__c, Poster_Path__c, Budget__c,Genres__c,Homepage__c,Overview__c,Release_Date__c,RuntimeRuntime__c,Revenue__c FROM MG_Movie__c WHERE Id = :movieId];
            res = MG_MovieDetails.toMovie(movie);
        } else {
            System.debug('id: ' + movieId);
            MG_WebserviceHandler handler = new MG_WebserviceHandler();
            res = handler.getMovieDetails(movieId);
            System.debug('response in apex : ' + res);
        }
        /*
        List<MG_CollectionItem__c> items = [
                SELECT IsBlackListed__c, IsFavourite__c
                FROM MG_CollectionItem__c
                WHERE Movie_Id__c = :res.id AND User__c = :UserInfo.getUserId()
                LIMIT 1
        ];
        if (!items.isEmpty()) {
            res.isBlackListed = items.get(0).IsBlackListed__c;
            res.isFavourite = items.get(0).IsFavourite__c;
        }

         */
        List<MG_MovieReview__c> reviews = [SELECT Rating__c FROM MG_MovieReview__c WHERE Movie_Id__c = :res.id];
        res.vote_count = Integer.valueOf(reviews.size());
        Integer voteSUm = 0;
        for (MG_MovieReview__c rev : reviews) {
            voteSUm += (Integer) rev.Rating__c;
        }
        if (res.vote_count == 0) {
            res.vote_average = 0;
        } else {
            res.vote_average = voteSUm / res.vote_count;
        }
        List<MG_CollectionItem__c> items = [
                SELECT IsBlackListed__c, IsFavourite__c
                FROM MG_CollectionItem__c
                WHERE Movie_Id__c = :res.id AND User__c = :UserInfo.getUserId()
                LIMIT 1
        ];
        if (!items.isEmpty()) {
            res.isBlackListed = items.get(0).IsBlackListed__c;
            res.isFavourite = items.get(0).IsFavourite__c;
            System.debug('res in movies' + res);
        }
        List<MG_MovieReview__c> revs = [SELECT Id FROM MG_MovieReview__c WHERE Movie_Id__c = :res.Id AND CreatedById = :UserInfo.getUserId()];
        System.debug('revs for movie : ' + revs.size());
        if (!revs.isEmpty()) {
            res.isReviewed = true;
        } else {
            res.isReviewed = false;
        }

        return res;
    }
    @AuraEnabled
    public static MG_MovieResults getPopularMovies() {
        System.debug('popular: ');
        MG_WebserviceHandler handler = new MG_WebserviceHandler();
        MG_MovieResults res = handler.getPopularMovies();
        for (MG_MovieResults.Results result : res.results) {
            List<MG_CollectionItem__c> items = [
                    SELECT IsBlackListed__c, IsFavourite__c
                    FROM MG_CollectionItem__c
                    WHERE Movie_Id__c = :result.id AND User__c = :UserInfo.getUserId()
                    LIMIT 1
            ];
            if (!items.isEmpty()) {
                result.isBlackListed = items.get(0).IsBlackListed__c;
                result.isFavourite = items.get(0).IsFavourite__c;
                System.debug('res in get movies' + result);
            }
        }
        System.debug('response in apex : ' + res);
        return res;
    }
    @AuraEnabled
    public static MG_MovieResults getRandomMovies() {
        System.debug('random: ');
        MG_WebserviceHandler handler = new MG_WebserviceHandler();
        MG_MovieResults res = handler.getRandomMovies();
        System.debug('random in apex : ' + res);
        return res;
    }
    @AuraEnabled
    public static MG_MovieCastCrew getMovieCastCrew(String movieId) {
        System.debug('id: ' + movieId);
        MG_WebserviceHandler handler = new MG_WebserviceHandler();
        MG_MovieCastCrew res = handler.getMovieCastCrew(movieId);
        System.debug('castcrew in apex : ' + res.cast_Z);
        return res;
    }
    @AuraEnabled
    public static MG_MovieImages getMovieImages(String movieId) {
        System.debug('id: ' + movieId);
        MG_WebserviceHandler handler = new MG_WebserviceHandler();
        MG_MovieImages res = handler.getMovieImages(movieId);
        System.debug('images in apex : ' + res.posters);
        return res;
    }
    @AuraEnabled
    public static MG_PersonDetails getPersonDetails(String personId) {
        System.debug('id: ' + personId);
        MG_WebserviceHandler handler = new MG_WebserviceHandler();
        MG_PersonDetails res = handler.getPersonDetails(personId);
        System.debug('response in apex : ' + res);
        return res;
    }
    @AuraEnabled
    public static MG_PersonCredits getPersonCredits(String personId) {
        System.debug('id: ' + personId);
        MG_WebserviceHandler handler = new MG_WebserviceHandler();
        MG_PersonCredits res = handler.getPersonCredits(personId);
        System.debug('response in apex : ' + res);
        return res;
    }
    @AuraEnabled
    public static List<MG_MovieReview__C> getReviews(String movieId) {
        return [
                SELECT Id, Name, Comment__c, Rating__c, CreatedDate, CreatedBy.Name,CreatedBy.SmallPhotoUrl,
                        CreatedBy.CompanyName
                FROM MG_MovieReview__C
                WHERE Movie_Id__c LIKE :movieId
                ORDER BY CreatedDate DESC
        ];
    }
    @AuraEnabled
    public static List<MG_MovieReview__C> getReviewsForUser(String userId) {
        return [
                SELECT Id, Name, Comment__c, Rating__c, CreatedDate, CreatedBy.Name,CreatedBy.SmallPhotoUrl,
                        CreatedBy.CompanyName, Movie_Id__c, Image_Path__c
                FROM MG_MovieReview__C
                WHERE CreatedById = :userId
                ORDER BY CreatedDate DESC
        ];
    }
    @AuraEnabled
    public static Boolean setFavourite(String movieId, String userId, Boolean value) {
        List<MG_CollectionItem__c> items = [SELECT Id, IsBlackListed__c, IsFavourite__c FROM MG_CollectionItem__c WHERE Movie_Id__c = :movieId AND User__c = :userId LIMIT 1];
        MG_CollectionItem__c item = null;
        if (items.isEmpty()) {
            item = new MG_CollectionItem__c(Movie_Id__c = movieId, User__c = userId);
        } else {
            item = items[0];
        }
        item.IsFavourite__c = value;
        Database.UpsertResult ups = Database.upsert(item);
        if (ups.isSuccess()) {
            return true;
        }
        return false;
    }
    @AuraEnabled
    public static Boolean setBlackListed(String movieId, String userId, Boolean value) {
        List<MG_CollectionItem__c> items = [SELECT Id, IsBlackListed__c, IsFavourite__c FROM MG_CollectionItem__c WHERE Movie_Id__c = :movieId AND User__c = :userId LIMIT 1];
        MG_CollectionItem__c item = null;
        if (items.isEmpty()) {
            item = new MG_CollectionItem__c(Movie_Id__c = movieId, User__c = userId);
        } else {
            item = items[0];
        }
        item.IsBlackListed__c = value;
        Database.UpsertResult ups = Database.upsert(item);
        if (ups.isSuccess()) {
            return true;
        }
        return false;
    }
    @AuraEnabled
    public static List<MG_MovieDetails> getUserCollection(String userId) {
        List<MG_CollectionItem__c> items = [SELECT Id,Movie_Id__c, IsBlackListed__c, IsFavourite__c FROM MG_CollectionItem__c WHERE User__c = :userId];
        List<MG_MovieDetails> userMovies = new List<MG_MovieDetails>();
        for (MG_CollectionItem__c item : items) {
            MG_MovieDetails movie = MG_MainContainerController.getMovieDetails(item.Movie_Id__c);
            movie.isFavourite = item.IsFavourite__c;
            movie.isBlackListed = item.IsBlackListed__c;
            userMovies.add(movie);
        }


        return userMovies;
    }
    @AuraEnabled
    public static Boolean checkMovie(String movieTitle, Date movieDate) {
        System.debug('in check movie: ');
        System.debug('title: ' + movieTitle);
        System.debug('date: ' + movieDate);
        List<MG_Movie__c> movies = [SELECT Id FROM MG_Movie__c WHERE Title__c = :movieTitle AND Release_Date__c = :movieDate];
        return movies.isEmpty();
    }
    @AuraEnabled
    public static Id saveAttachment(String parentId, String fileName, String base64Data, String contentType) {

        Attachment attachment = new Attachment();
        attachment.ParentId = parentId;
        attachment.Body = EncodingUtil.base64Decode(base64Data);
        attachment.Name = fileName;
        attachment.ContentType = contentType;
        insert attachment;
        return attachment.id;
    }
    @AuraEnabled
    public static Boolean saveTimelineEvent(String actionName, String description) {
        MG_TimeLine_Event__c tEvent = new MG_Timeline_Event__c();
        tEvent.User__c = UserInfo.getUserId();
        tEvent.Action_Name__c = actionName;
        tEvent.Description__c = description;
        System.debug('new event :'+tEvent);
        Database.SaveResult res = Database.insert(tEvent);
        return res.isSuccess();
    }
    @AuraEnabled
    public static List<MG_Timeline_Event__c> getTimeline() {
        return [SELECT Id, Name, Action_Name__c, Description__c, CreatedDate FROM MG_Timeline_Event__c WHERE User__c=:UserInfo.getUserId() ORDER BY CreatedDate DESC ];
    }
}