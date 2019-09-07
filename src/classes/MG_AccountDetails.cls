public class MG_AccountDetails {

    public class Gravatar {
        public String hash;
    }

    public class Avatar {
        public Gravatar gravatar;
    }

    public Avatar avatar;
    public Integer id;
    public String iso_639_1;
    public String iso_3166_1;
    public String name;
    public Boolean include_adult;
    public String username;


    public static MG_AccountDetails parse(String json) {
        return (MG_AccountDetails) System.JSON.deserialize(json, MG_AccountDetails.class);
    }
}