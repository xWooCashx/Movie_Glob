//
// Generated by JSON2Apex http://json2apex.herokuapp.com/
//
// The supplied json has fields with names that are not valid in apex
// and so can only be parsed with explicitly generated code, this option
// was auto selected for you.

public class MG_MovieCastCrew {

    public class Crew {
        @auraenabled
        public String credit_id {get;set;}
        @auraenabled
        public String department {get;set;}
        @auraenabled
        public Integer gender {get;set;}
        @auraenabled
        public Integer id {get;set;}
        @auraenabled
        public String job {get;set;}
        @auraenabled
        public String name {get;set;}
        @auraenabled
        public String profile_path {get;set;}

        public Crew(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'credit_id') {
                            credit_id = parser.getText();
                        } else if (text == 'department') {
                            department = parser.getText();
                        } else if (text == 'gender') {
                            gender = parser.getIntegerValue();
                        } else if (text == 'id') {
                            id = parser.getIntegerValue();
                        } else if (text == 'job') {
                            job = parser.getText();
                        } else if (text == 'name') {
                            name = parser.getText();
                        } else if (text == 'profile_path') {
                            profile_path = parser.getText();
                        } else {
                            System.debug(LoggingLevel.WARN, 'Crew consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
@auraenabled
    public Integer id {get;set;}
    @auraenabled
    public List<Cast_Z> cast_Z {get;set;} // in json: cast
    @auraenabled
    public List<Crew> crew {get;set;}

    public MG_MovieCastCrew(JSONParser parser) {
        while (parser.nextToken() != System.JSONToken.END_OBJECT) {
            if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                String text = parser.getText();
                if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                    if (text == 'id') {
                        id = parser.getIntegerValue();
                    } else if (text == 'cast') {
                        cast_Z = arrayOfCast_Z(parser);
                    } else if (text == 'crew') {
                        crew = arrayOfCrew(parser);
                    } else {
                        System.debug(LoggingLevel.WARN, 'MG_MovieCastCrew consuming unrecognized property: '+text);
                        consumeObject(parser);
                    }
                }
            }
        }
    }

    public class Cast_Z {
        @auraenabled
        public Integer cast_id {get;set;}
        @auraenabled
        public String character {get;set;}
        @auraenabled
        public String credit_id {get;set;}
        @auraenabled
        public Integer gender {get;set;}
        @auraenabled
        public Integer id {get;set;}
        @auraenabled
        public String name {get;set;}
        @auraenabled
        public Integer order {get;set;}
        @auraenabled
        public String profile_path {get;set;}

        public Cast_Z(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'cast_id') {
                            cast_id = parser.getIntegerValue();
                        } else if (text == 'character') {
                            character = parser.getText();
                        } else if (text == 'credit_id') {
                            credit_id = parser.getText();
                        } else if (text == 'gender') {
                            gender = parser.getIntegerValue();
                        } else if (text == 'id') {
                            id = parser.getIntegerValue();
                        } else if (text == 'name') {
                            name = parser.getText();
                        } else if (text == 'order') {
                            order = parser.getIntegerValue();
                        } else if (text == 'profile_path') {
                            profile_path = parser.getText();
                        } else {
                            System.debug(LoggingLevel.WARN, 'Cast_Z consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }


    public static MG_MovieCastCrew parse(String json) {
        System.JSONParser parser = System.JSON.createParser(json);
        return new MG_MovieCastCrew(parser);
    }

    public static void consumeObject(System.JSONParser parser) {
        Integer depth = 0;
        do {
            System.JSONToken curr = parser.getCurrentToken();
            if (curr == System.JSONToken.START_OBJECT ||
                    curr == System.JSONToken.START_ARRAY) {
                depth++;
            } else if (curr == System.JSONToken.END_OBJECT ||
                    curr == System.JSONToken.END_ARRAY) {
                depth--;
            }
        } while (depth > 0 && parser.nextToken() != null);
    }



    private static List<Crew> arrayOfCrew(System.JSONParser p) {
        List<Crew> res = new List<Crew>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new Crew(p));
        }
        return res;
    }







    private static List<Cast_Z> arrayOfCast_Z(System.JSONParser p) {
        List<Cast_Z> res = new List<Cast_Z>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new Cast_Z(p));
        }
        return res;
    }



}