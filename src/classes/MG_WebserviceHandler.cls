/**
 * Created by BRITENET on 01.09.2019.
 */

public with sharing class MG_WebserviceHandler {
    private Cache.SessionPartition partition;
    private final String API_KEY = '5aa5522364007747ff2ae654f626fa37';
    private final String ENDPOINT = 'https://api.themoviedb.org/3/';
    public MG_WebserviceHandler() {

    }
    public MG_AccountDetails getAccountDetails() {
        String endpointSuffix = 'account?api_key=' + API_KEY;
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);
        return MG_AccountDetails.parse(response.getBody());
    }
    public MG_MovieResults getMovies(String query, Integer pageNumber) {
        String endpointSuffix = 'search/movie?api_key=' + API_KEY + '&language=en-US&page=' + pageNumber + '&include_adult=false';
        if (!String.isEmpty(query)) {
            endpointSuffix += '&query=' + query;
        }
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);
        return MG_MovieResults.parse(response.getBody());
    }
    public MG_MovieResults getPopularMovies() {
        String endpointSuffix = 'movie/popular?api_key=' + API_KEY + '&language=en-US&page=' + 1 + '&include_adult=false';
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);
        return MG_MovieResults.parse(response.getBody());
    }
    public MG_MovieResults getRandomMovies() {
        String endpointSuffix = 'movie/popular?api_key=' + API_KEY + '&language=en-US&page=' + ((Integer) (Math.random() * 400)) + '&include_adult=false';
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);
        return MG_MovieResults.parse(response.getBody());
    }
    public MG_MovieDetails getMovieDetails(String movieId) {
//        String endpointSuffix = 'movie?api_key=' + API_KEY + '&language=en-US&page=1&include_adult=false';
        String endpointSuffix = 'movie/' + movieId + '?api_key=' + API_KEY + '&language=en-US';
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);
        if (response.getStatusCode() == 200) {
            System.debug('response : ' + response.getBody());
            return MG_MovieDetails.parse(response.getBody());
        } else {
            System.debug('null in get m det');
            return null;
        }
    }
    public MG_MovieCastCrew getMovieCastCrew(String movieId) {
        String endpointSuffix = 'movie/' + movieId + '/credits?api_key=' + API_KEY ;
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);

        System.debug('response cast crew : ' + response.getBody());
        return MG_MovieCastCrew.parse(response.getBody());
    }
    public MG_MovieImages getMovieImages(String movieId) {
        String endpointSuffix = 'movie/' + movieId + '/images?api_key=' + API_KEY+'&include_image_language=en,null';

        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);

        System.debug('images in resp: ' + response.getBody());
        return MG_MovieImages.parse(response.getBody());
    }
    public MG_PeopleResults getPeople(String query, Integer pageNumber) {
        String endpointSuffix = 'search/person?api_key=' + API_KEY + '&language=en-US&page=' + pageNumber + '&include_adult=false';
        if (!String.isEmpty(query)) {
            endpointSuffix += '&query=' + query;
        }
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);
        return MG_PeopleResults.parse(response.getBody());
    }
    public MG_PersonDetails getPersonDetails(String personId) {
        String endpointSuffix = 'person/' + personId + '?api_key=' + API_KEY + '&language=en-US';
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);
        System.debug('details for person : ' + response.getBody());
        return MG_PersonDetails.parse(response.getBody());
    }
    public MG_PersonCredits getPersonCredits(String personId) {
        String endpointSuffix = 'person/' + personId + '/movie_credits?api_key=' + API_KEY + '&language=en-US';
        HttpResponse response = getHttpResponse(endpointSuffix, 'GET', null);
        System.debug('credits for person : ' + response.getBody());
        return MG_PersonCredits.parse(response.getBody());
    }

    private HTTPResponse getHttpResponse(String endpointSuffix, String requestMethod, Map<String, String> requestBodyValues) {
        HttpRequest customRequest = new HttpRequest();
        customRequest.setEndpoint(ENDPOINT + endpointSuffix);
        customRequest.setMethod(requestMethod);
        System.debug('method type :' + requestMethod);
        customRequest.setHeader('Content-Type', 'application/json;');
        if (requestBodyValues != null) {
            customRequest.setBody(JSON.serialize(requestBodyValues));
        }
        Http customHttp = new Http();
        System.debug('request ready ');
        HttpResponse responseFromHD = customHttp.send(customRequest);
        System.debug('response ready ');

        if (responseFromHD.getStatusCode() == 200) {
            if (responseFromHD.getBody().contains(System.Label.Error)) {
                throw new HX_CustomException(responseFromHD.getBody());
            }
            return responseFromHD;
        }
        throw new HX_CustomException(responseFromHD.getBody());
    }
}