//             READ ME 
//   Welcome to Guardicore TestUtils!
//   Please run following script in global scope!

//--GENERATOR CONFIG PARAMETERS--
var selectedTable = "cmdb_ci_server"; // Select a table where cmdb parent records will be generated. 
var childTable = "cmdb_ci_business_app"; // Select a child table where cmdb child records will be generated.
var amount = 100; // Select amount of records to generate in parent cmdb.
var child_amount = 20; // Select amount of records to generate in child cmdb. Populates from parent for easier relation creation.               
var prefix = 'Parent Load Service '; //Custom prefix added to any parent record generated!
var child_prefix = 'Child Load Service '; //Custom prefix added to any child record generated!
var relationshipType = '1a9cb166f1571100a92eb60da2bce5c5'; // Encoded sys_id of relationship type will be generated for all records from list_of_parents and list_of_child. You could modify it if you need different relation to be generated! 'Depends on::Used by' relation is used by default!
var need_rel = true; // If false relationships will not be generated! True by default!
var need_child = true; // If false child tables will not be generated! True by default!      
var one_on_one = false; // Enables generation mode to relate parent to child table one by one. True by default.
var random_by_random = true; // Enables generation mode randoming amount of relations to be generated for one record on certain selected range.		
var excludefield = new Array('', ''); // Add names of the field you WON'T generate for this generation separated by ','!
var minRelationships = 2; // Determines min amount of relation will be populated for following generation per record!
var maxRelationships = 3; // Determines max amount of relation will be populated for following generation per record!
var lvlgen = false; // If true enables relation generation by lvls hierarhy!
var maxLevels = 1; // Determines depth of lvls of hierarhy relations will be populated for following generation!

//--DELETE MODE CONFIG PARAMETERS--
var del_prefix = 'Parent Load Service ';
var delete_mode = false; // If true script will only delete certain tables from selected CMDB!
var ciFilter = ''; //Paste your encoded query here!				
var enable_by_prefix = true; // If true delete function will run by prefix!
var enable_by_filter = false; // If true delete function will run by your custom filter!	

//--POPULATE CUSTOM FIELD MODE PARAMETERS--
var PCF_mode = false; // Enables value generation for your custom selected fields. False by default!
var pop_index = true;  // Determines an index for every custom field to be populated for custom fields generation.
var c_fields = new Array('',''); // Array of your custom fields system names, you can add any amount of those.
var value = new Array (' '); // Value that will be populated for every field selected for certain genereation. 

//--POPULATE ANY FIELD MODE
var PAF_mode = true; // Enabels generation of selected type of a custom field by prefix 
var table = selectedTable; // Select a table to query
var recordPrefix = ""; //Type a prefix of needed records to populate field or paste prefix variable to do it after generation immediately
var FieldType = {
	String: "String",
	Integer: "Integer",
	Boolean: "Boolean",
	Choice: "Choice"
}; // FieldType object. Do not custom!
var field = "u_custom_integer_field"; //Select a sys name of the field 
var fieldType = FieldType.Integer; // Select a field type from an object
var strValuePrefix = "CustomStringP "; // String value
var choices = ["value1", "value2", "value3"]; // Choice field values

//--POPULATE CUSTOM RELATIONS MODE PARAMETERS--
var PCR_mode = false; // Enables mode for target relation generation by query of prefix. False by default.
var en_prefix = true; // Add query by prefix 
var pr_rel_prefix = 'Gen '; // Will query all tables which was generated with default prefixes. Use your custom prefixes if you have changed default ones in your generation.
var ch_rel_prefix = 'Child Gen '; // Will query all tables which was generated with default prefixes. Use your custom prefixes if you have changed default ones in your generation.
var en_filter = false; // Add copied query for relations
var rel_query = ''; // Field for query pasting for relationship creation
var ch_rel_query = ''; // Field for query pasting for relationship creation
var manual_id = false; // Disables id's of records collection from query and prefix and adds a possibility to generate relation by manualy added id's.
var child_arr = new Array('',''); // Array for records ids's to generate relations 
var parent_arr = new Array('',''); // Array for records ids's to generate relations

//--POPULATE CUSTOM IP ADRESS IN RANGE MODE PARAMETERS--
var custom_IP = false; //Enables mode for generation custom IP's in selected range for next records generation. False by default.
var startRange = '192.168.0.1'; // Start range of number of each position will be generated for certain generation. 192.168.0.1 floor of id range by default. 
//ATTENTION!!! Field startRange could cause instance overload if configured wrong. Please double check the IP range you want to populate for following generation before running script!
var endRange = '192.168.0.255'; // End of the range of number of each position will be generated for certain generation. 192.168.0.255 cealing of id range by default. 
//ATTENTION!!! Field endRange could cause instance overload if configured wrong. Please double check the IP range you want to populate for following generation before running script!


//--MAIN BODY--
var genRecords = new GlideRecord(selectedTable);
var genChildRecords = new GlideRecord(childTable);
//Delete records if needed
if (delete_mode == true) {
    if (enable_by_prefix == true) {
        deleteRecordsByPrefix(selectedTable, childTable, del_prefix);
    }
    if (enable_by_filter == true) {
        deleteRecordsByFilter(selectedTable, ciFilter);
    }

} else {
    // Generating only relationships for already existing tables via query or prefix
    if (PCR_mode == true) {
	createCustomRel(selectedTable, childTable, parent_arr, child_arr, relationshipType, rel_query, ch_rel_query, manual_id, en_filter, en_prefix, pr_rel_prefix, ch_rel_prefix);
	} else {
	
	// Pregenerate IP's to populate in custom range
	if (custom_IP == true) {
	var generatedIPs = generateIPAddresses(startRange, endRange);
	}
	
    // Generating parent records
    var type_of_array = 'Parent';
    var list_of_parents = executeRule(excludefield, genRecords, amount, prefix, type_of_array, PCF_mode, pop_index, c_fields, value, custom_IP, generatedIPs);
    //Generating child records
    if (need_child == true) {
        type_of_array = 'Child';
        var list_of_child = executeRule(excludefield, genChildRecords, child_amount, child_prefix, type_of_array, PCF_mode, pop_index, c_fields, value, custom_IP, generatedIPs);

    } else {
        gs.info('Child tables was not created due to config parameter need_child set false!');
    }

    //Generating relations
    if (need_rel == true) {
        if (lvlgen == true) {
            generateHierarchicalRelationships(list_of_parents, list_of_child, relationshipType, maxLevels);
        } else {
            if (one_on_one == true) {
                createRelationships(list_of_parents, list_of_child, relationshipType);
            }
            if (random_by_random == true) {
                generateRanRelationships(list_of_parents, list_of_child, minRelationships, maxRelationships, relationshipType);
            }
        }
    } else {
        gs.info('Relations was not generated due to parameter need_rel set false!');
    }
	if (PAF_mode == true){
	populateFields(table, recordPrefix, field, fieldType, strValuePrefix, choices);
	}
}
}


function genMAC() {
    var hexDigits = "0123456789ABCDEF";
    var macAddress = "";
    for (var i = 0; i < 6; i++) {
        macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
        macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
        if (i != 5) macAddress += ":";
    }

    return macAddress;
}

//generating hostname
function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateName() {
    var name1 = ["abandoned", "able", "absolute", "adorable", "adventurous", "academic", "acceptable", "acclaimed", "accomplished", "accurate", "aching", "acidic", "acrobatic", "active", "actual", "adept", "admirable", "admired", "adolescent", "adorable", "adored", "advanced", "afraid", "affectionate", "aged", "aggravating", "aggressive", "agile", "agitated", "agonizing", "agreeable", "ajar", "alarmed", "alarming", "alert", "alienated", "alive", "all", "altruistic", "amazing", "ambitious", "ample", "amused", "amusing", "anchored", "ancient", "angelic", "angry", "anguished", "animated", "annual", "another", "antique", "anxious", "any", "apprehensive", "appropriate", "apt", "arctic", "arid", "aromatic", "artistic", "ashamed", "assured", "astonishing", "athletic", "attached", "attentive", "attractive", "austere", "authentic", "authorized", "automatic", "avaricious", "average", "aware", "awesome", "awful", "awkward", "babyish", "bad", "back", "baggy", "bare", "barren", "basic", "beautiful", "belated", "beloved", "beneficial", "better", "best", "bewitched", "big", "big-hearted", "biodegradable", "bite-sized", "bitter", "black", "black-and-white", "bland", "blank", "blaring", "bleak", "blind", "blissful", "blond", "blue", "blushing", "bogus", "boiling", "bold", "bony", "boring", "bossy", "both", "bouncy", "bountiful", "bowed", "brave", "breakable", "brief", "bright", "brilliant", "brisk", "broken", "bronze", "brown", "bruised", "bubbly", "bulky", "bumpy", "buoyant", "burdensome", "burly", "bustling", "busy", "buttery", "buzzing", "calculating", "calm", "candid", "canine", "capital", "carefree", "careful", "careless", "caring", "cautious", "cavernous", "celebrated", "charming", "cheap", "cheerful", "cheery", "chief", "chilly", "chubby", "circular", "classic", "clean", "clear", "clear-cut", "clever", "close", "closed", "cloudy", "clueless", "clumsy", "cluttered", "coarse", "cold", "colorful", "colorless", "colossal", "comfortable", "common", "compassionate", "competent", "complete", "complex", "complicated", "composed", "concerned", "concrete", "confused", "conscious", "considerate", "constant", "content", "conventional", "cooked", "cool", "cooperative", "coordinated", "corny", "corrupt", "costly", "courageous", "courteous", "crafty", "crazy", "creamy", "creative", "creepy", "criminal", "crisp", "critical", "crooked", "crowded", "cruel", "crushing", "cuddly", "cultivated", "cultured", "cumbersome", "curly", "curvy", "cute", "cylindrical", "damaged", "damp", "dangerous", "dapper", "daring", "darling", "dark", "dazzling", "dead", "deadly", "deafening", "dear", "dearest", "decent", "decimal", "decisive", "deep", "defenseless", "defensive", "defiant", "deficient", "definite", "definitive", "delayed", "delectable", "delicious", "delightful", "delirious", "demanding", "dense", "dental", "dependable", "dependent", "descriptive", "deserted", "detailed", "determined", "devoted", "different", "difficult", "digital", "diligent", "dim", "dimpled", "dimwitted", "direct", "disastrous", "discrete", "disfigured", "disgusting", "disloyal", "dismal", "distant", "downright", "dreary", "dirty", "disguised", "dishonest", "dismal", "distant", "distinct", "distorted", "dizzy", "dopey", "doting", "double", "downright", "drab", "drafty", "dramatic", "dreary", "droopy", "dry", "dual", "dull", "dutiful", "each", "eager", "earnest", "early", "easy", "easy-going", "ecstatic", "edible", "educated", "elaborate", "elastic", "elated", "elderly", "electric", "elegant", "elementary", "elliptical", "embarrassed", "embellished", "eminent", "emotional", "empty", "enchanted", "enchanting", "energetic", "enlightened", "enormous", "enraged", "entire", "envious", "equal", "equatorial", "essential", "esteemed", "ethical", "euphoric", "even", "evergreen", "everlasting", "every", "evil", "exalted", "excellent", "exemplary", "exhausted", "excitable", "excited", "exciting", "exotic", "expensive", "experienced", "expert", "extraneous", "extroverted", "extra-large", "extra-small", "fabulous", "failing", "faint", "fair", "faithful", "fake", "false", "familiar", "famous", "fancy", "fantastic", "far", "faraway", "far-flung", "far-off", "fast", "fat", "fatal", "fatherly", "favorable", "favorite", "fearful", "fearless", "feisty", "feline", "female", "feminine", "few", "fickle", "filthy", "fine", "finished", "firm", "first", "firsthand", "fitting", "fixed", "flaky", "flamboyant", "flashy", "flat", "flawed", "flawless", "flickering", "flimsy", "flippant", "flowery", "fluffy", "fluid", "flustered", "focused", "fond", "foolhardy", "foolish", "forceful", "forked", "formal", "forsaken", "forthright", "fortunate", "fragrant", "frail", "frank", "frayed", "free", "French", "fresh", "frequent", "friendly", "frightened", "frightening", "frigid", "frilly", "frizzy", "frivolous", "front", "frosty", "frozen", "frugal", "fruitful", "full", "fumbling", "functional", "funny", "fussy", "fuzzy", "gargantuan", "gaseous", "general", "generous", "gentle", "genuine", "giant", "giddy", "gigantic", "gifted", "giving", "glamorous", "glaring", "glass", "gleaming", "gleeful", "glistening", "glittering", "gloomy", "glorious", "glossy", "glum", "golden", "good", "good-natured", "gorgeous", "graceful", "gracious", "grand", "grandiose", "granular", "grateful", "grave", "gray", "great", "greedy", "green", "gregarious", "grim", "grimy", "gripping", "grizzled", "gross", "grotesque", "grouchy", "grounded", "growing", "growling", "grown", "grubby", "gruesome", "grumpy", "guilty", "gullible", "gummy", "hairy", "half", "handmade", "handsome", "handy", "happy", "happy-go-lucky", "hard", "hard-to-find", "harmful", "harmless", "harmonious", "harsh", "hasty", "hateful", "haunting", "healthy", "heartfelt", "hearty", "heavenly", "heavy", "hefty", "helpful", "helpless", "hidden", "hideous", "high", "high-level", "hilarious", "hoarse", "hollow", "homely", "honest", "honorable", "honored", "hopeful", "horrible", "hospitable", "hot", "huge", "humble", "humiliating", "humming", "humongous", "hungry", "hurtful", "husky", "icky", "icy", "ideal", "idealistic", "identical", "idle", "idiotic", "idolized", "ignorant", "ill", "illegal", "ill-fated", "ill-informed", "illiterate", "illustrious", "imaginary", "imaginative", "immaculate", "immaterial", "immediate", "immense", "impassioned", "impeccable", "impartial", "imperfect", "imperturbable", "impish", "impolite", "important", "impossible", "impractical", "impressionable", "impressive", "improbable", "impure", "inborn", "incomparable", "incompatible", "incomplete", "inconsequential", "incredible", "indelible", "inexperienced", "indolent", "infamous", "infantile", "infatuated", "inferior", "infinite", "informal", "innocent", "insecure", "insidious", "insignificant", "insistent", "instructive", "insubstantial", "intelligent", "intent", "intentional", "interesting", "internal", "international", "intrepid", "ironclad", "irresponsible", "irritating", "itchy", "jaded", "jagged", "jam-packed", "jaunty", "jealous", "jittery", "joint", "jolly", "jovial", "joyful", "joyous", "jubilant", "judicious", "juicy", "jumbo", "junior", "jumpy", "juvenile", "kaleidoscopic", "keen", "key", "kind", "kindhearted", "kindly", "klutzy", "knobby", "knotty", "knowledgeable", "knowing", "known", "kooky", "kosher", "lame", "lanky", "large", "last", "lasting", "late", "lavish", "lawful", "lazy", "leading", "lean", "leafy", "left", "legal", "legitimate", "light", "lighthearted", "likable", "likely", "limited", "limp", "limping", "linear", "lined", "liquid", "little", "live", "lively", "livid", "loathsome", "lone", "lonely", "long", "long-term", "loose", "lopsided", "lost", "loud", "lovable", "lovely", "loving", "low", "loyal", "lucky", "lumbering", "luminous", "lumpy", "lustrous", "luxurious", "mad", "made-up", "magnificent", "majestic", "major", "male", "mammoth", "married", "marvelous", "masculine", "massive", "mature", "meager", "mealy", "mean", "measly", "meaty", "medical", "mediocre", "medium", "meek", "mellow", "melodic", "memorable", "menacing", "merry", "messy", "metallic", "mild", "milky", "mindless", "miniature", "minor", "minty", "miserable", "miserly", "misguided", "misty", "mixed", "modern", "modest", "moist", "monstrous", "monthly", "monumental", "moral", "mortified", "motherly", "motionless", "mountainous", "muddy", "muffled", "multicolored", "mundane", "murky", "mushy", "musty", "muted", "mysterious", "naive", "narrow", "nasty", "natural", "naughty", "nautical", "near", "neat", "necessary", "needy", "negative", "neglected", "negligible", "neighboring", "nervous", "new", "next", "nice", "nifty", "nimble", "nippy", "nocturnal", "noisy", "nonstop", "normal", "notable", "noted", "noteworthy", "novel", "noxious", "numb", "nutritious", "nutty", "obedient", "obese", "oblong", "oily", "oblong", "obvious", "occasional", "odd", "oddball", "offbeat", "offensive", "official", "old", "old-fashioned", "only", "open", "optimal", "optimistic", "opulent", "orange", "orderly", "organic", "ornate", "ornery", "ordinary", "original", "other", "our", "outlying", "outgoing", "outlandish", "outrageous", "outstanding", "oval", "overcooked", "overdue", "overjoyed", "overlooked", "palatable", "pale", "paltry", "parallel", "parched", "partial", "passionate", "past", "pastel", "peaceful", "peppery", "perfect", "perfumed", "periodic", "perky", "personal", "pertinent", "pesky", "pessimistic", "petty", "phony", "physical", "piercing", "pink", "pitiful", "plain", "plaintive", "plastic", "playful", "pleasant", "pleased", "pleasing", "plump", "plush", "polished", "polite", "political", "pointed", "pointless", "poised", "poor", "popular", "portly", "posh", "positive", "possible", "potable", "powerful", "powerless", "practical", "precious", "present", "prestigious", "pretty", "precious", "previous", "pricey", "prickly", "primary", "prime", "pristine", "private", "prize", "probable", "productive", "profitable", "profuse", "proper", "proud", "prudent", "punctual", "pungent", "puny", "pure", "purple", "pushy", "putrid", "puzzled", "puzzling", "quaint", "qualified", "quarrelsome", "quarterly", "queasy", "querulous", "questionable", "quick", "quick-witted", "quiet", "quintessential", "quirky", "quixotic", "quizzical", "radiant", "ragged", "rapid", "rare", "rash", "raw", "recent", "reckless", "rectangular", "ready", "real", "realistic", "reasonable", "red", "reflecting", "regal", "regular", "reliable", "relieved", "remarkable", "remorseful", "remote", "repentant", "required", "respectful", "responsible", "repulsive", "revolving", "rewarding", "rich", "rigid", "right", "ringed", "ripe", "roasted", "robust", "rosy", "rotating", "rotten", "rough", "round", "rowdy", "royal", "rubbery", "rundown", "ruddy", "rude", "runny", "rural", "rusty", "sad", "safe", "salty", "same", "sandy", "sane", "sarcastic", "sardonic", "satisfied", "scaly", "scarce", "scared", "scary", "scented", "scholarly", "scientific", "scornful", "scratchy", "scrawny", "second", "secondary", "second-hand", "secret", "self-assured", "self-reliant", "selfish", "sentimental", "separate", "serene", "serious", "serpentine", "several", "severe", "shabby", "shadowy", "shady", "shallow", "shameful", "shameless", "sharp", "shimmering", "shiny", "shocked", "shocking", "shoddy", "short", "short-term", "showy", "shrill", "shy", "sick", "silent", "silky", "silly", "silver", "similar", "simple", "simplistic", "sinful", "single", "sizzling", "skeletal", "skinny", "sleepy", "slight", "slim", "slimy", "slippery", "slow", "slushy", "small", "smart", "smoggy", "smooth", "smug", "snappy", "snarling", "sneaky", "sniveling", "snoopy", "sociable", "soft", "soggy", "solid", "somber", "some", "spherical", "sophisticated", "sore", "sorrowful", "soulful", "soupy", "sour", "Spanish", "sparkling", "sparse", "specific", "spectacular", "speedy", "spicy", "spiffy", "spirited", "spiteful", "splendid", "spotless", "spotted", "spry", "square", "squeaky", "squiggly", "stable", "staid", "stained", "stale", "standard", "starchy", "stark", "starry", "steep", "sticky", "stiff", "stimulating", "stingy", "stormy", "straight", "strange", "steel", "strict", "strident", "striking", "striped", "strong", "studious", "stunning", "stupendous", "stupid", "sturdy", "stylish", "subdued", "submissive", "substantial", "subtle", "suburban", "sudden", "sugary", "sunny", "super", "superb", "superficial", "superior", "supportive", "sure-footed", "surprised", "suspicious", "svelte", "sweaty", "sweet", "sweltering", "swift", "sympathetic", "tall", "talkative", "tame", "tan", "tangible", "tart", "tasty", "tattered", "taut", "tedious", "teeming", "tempting", "tender", "tense", "tepid", "terrible", "terrific", "testy", "thankful", "that", "these", "thick", "thin", "third", "thirsty", "this", "thorough", "thorny", "those", "thoughtful", "threadbare", "thrifty", "thunderous", "tidy", "tight", "timely", "tinted", "tiny", "tired", "torn", "total", "tough", "traumatic", "treasured", "tremendous", "tragic", "trained", "tremendous", "triangular", "tricky", "trifling", "trim", "trivial", "troubled", "true", "trusting", "trustworthy", "trusty", "truthful", "tubby", "turbulent", "twin", "ugly", "ultimate", "unacceptable", "unaware", "uncomfortable", "uncommon", "unconscious", "understated", "unequaled", "uneven", "unfinished", "unfit", "unfolded", "unfortunate", "unhappy", "unhealthy", "uniform", "unimportant", "unique", "united", "unkempt", "unknown", "unlawful", "unlined", "unlucky", "unnatural", "unpleasant", "unrealistic", "unripe", "unruly", "unselfish", "unsightly", "unsteady", "unsung", "untidy", "untimely", "untried", "untrue", "unused", "unusual", "unwelcome", "unwieldy", "unwilling", "unwitting", "unwritten", "upbeat", "upright", "upset", "urban", "usable", "used", "useful", "useless", "utilized", "utter", "vacant", "vague", "vain", "valid", "valuable", "vapid", "variable", "vast", "velvety", "venerated", "vengeful", "verifiable", "vibrant", "vicious", "victorious", "vigilant", "vigorous", "villainous", "violet", "violent", "virtual", "virtuous", "visible", "vital", "vivacious", "vivid", "voluminous", "wan", "warlike", "warm", "warmhearted", "warped", "wary", "wasteful", "watchful", "waterlogged", "watery", "wavy", "wealthy", "weak", "weary", "webbed", "wee", "weekly", "weepy", "weighty", "weird", "welcome", "well-documented", "well-groomed", "well-informed", "well-lit", "well-made", "well-off", "well-to-do", "well-worn", "wet", "which", "whimsical", "whirlwind", "whispered", "white", "whole", "whopping", "wicked", "wide", "wide-eyed", "wiggly", "wild", "willing", "wilted", "winding", "windy", "winged", "wiry", "wise", "witty", "wobbly", "woeful", "wonderful", "wooden", "woozy", "wordy", "worldly", "worn", "worried", "worrisome", "worse", "worst", "worthless", "worthwhile", "worthy", "wrathful", "wretched", "writhing", "wrong", "wry", "yawning", "yearly", "yellow", "yellowish", "young", "youthful", "yummy", "zany", "zealous", "zesty", "zigzag", "rocky"];

    var name2 = ["people", "history", "way", "art", "world", "information", "map", "family", "government", "health", "system", "computer", "meat", "year", "thanks", "music", "person", "reading", "method", "data", "food", "understanding", "theory", "law", "bird", "literature", "problem", "software", "control", "knowledge", "power", "ability", "economics", "love", "internet", "television", "science", "library", "nature", "fact", "product", "idea", "temperature", "investment", "area", "society", "activity", "story", "industry", "media", "thing", "oven", "community", "definition", "safety", "quality", "development", "language", "management", "player", "variety", "video", "week", "security", "country", "exam", "movie", "organization", "equipment", "physics", "analysis", "policy", "series", "thought", "basis", "boyfriend", "direction", "strategy", "technology", "army", "camera", "freedom", "paper", "environment", "child", "instance", "month", "truth", "marketing", "university", "writing", "article", "department", "difference", "goal", "news", "audience", "fishing", "growth", "income", "marriage", "user", "combination", "failure", "meaning", "medicine", "philosophy", "teacher", "communication", "night", "chemistry", "disease", "disk", "energy", "nation", "road", "role", "soup", "advertising", "location", "success", "addition", "apartment", "education", "math", "moment", "painting", "politics", "attention", "decision", "event", "property", "shopping", "student", "wood", "competition", "distribution", "entertainment", "office", "population", "president", "unit", "category", "cigarette", "context", "introduction", "opportunity", "performance", "driver", "flight", "length", "magazine", "newspaper", "relationship", "teaching", "cell", "dealer", "debate", "finding", "lake", "member", "message", "phone", "scene", "appearance", "association", "concept", "customer", "death", "discussion", "housing", "inflation", "insurance", "mood", "woman", "advice", "blood", "effort", "expression", "importance", "opinion", "payment", "reality", "responsibility", "situation", "skill", "statement", "wealth", "application", "city", "county", "depth", "estate", "foundation", "grandmother", "heart", "perspective", "photo", "recipe", "studio", "topic", "collection", "depression", "imagination", "passion", "percentage", "resource", "setting", "ad", "agency", "college", "connection", "criticism", "debt", "description", "memory", "patience", "secretary", "solution", "administration", "aspect", "attitude", "director", "personality", "psychology", "recommendation", "response", "selection", "storage", "version", "alcohol", "argument", "complaint", "contract", "emphasis", "highway", "loss", "membership", "possession", "preparation", "steak", "union", "agreement", "cancer", "currency", "employment", "engineering", "entry", "interaction", "limit", "mixture", "preference", "region", "republic", "seat", "tradition", "virus", "actor", "classroom", "delivery", "device", "difficulty", "drama", "election", "engine", "football", "guidance", "hotel", "match", "owner", "priority", "protection", "suggestion", "tension", "variation", "anxiety", "atmosphere", "awareness", "bread", "climate", "comparison", "confusion", "construction", "elevator", "emotion", "employee", "employer", "guest", "height", "leadership", "mall", "manager", "operation", "recording", "respect", "sample", "transportation", "boring", "charity", "cousin", "disaster", "editor", "efficiency", "excitement", "extent", "feedback", "guitar", "homework", "leader", "mom", "outcome", "permission", "presentation", "promotion", "reflection", "refrigerator", "resolution", "revenue", "session", "singer", "tennis", "basket", "bonus", "cabinet", "childhood", "church", "clothes", "coffee", "dinner", "drawing", "hair", "hearing", "initiative", "judgment", "lab", "measurement", "mode", "mud", "orange", "poetry", "police", "possibility", "procedure", "queen", "ratio", "relation", "restaurant", "satisfaction", "sector", "signature", "significance", "song", "tooth", "town", "vehicle", "volume", "wife", "accident", "airport", "appointment", "arrival", "assumption", "baseball", "chapter", "committee", "conversation", "database", "enthusiasm", "error", "explanation", "farmer", "gate", "girl", "hall", "historian", "hospital", "injury", "instruction", "maintenance", "manufacturer", "meal", "perception", "pie", "poem", "presence", "proposal", "reception", "replacement", "revolution", "river", "son", "speech", "tea", "village", "warning", "winner", "worker", "writer", "assistance", "breath", "buyer", "chest", "chocolate", "conclusion", "contribution", "cookie", "courage", "desk", "drawer", "establishment", "examination", "garbage", "grocery", "honey", "impression", "improvement", "independence", "insect", "inspection", "inspector", "king", "ladder", "menu", "penalty", "piano", "potato", "profession", "professor", "quantity", "reaction", "requirement", "salad", "sister", "supermarket", "tongue", "weakness", "wedding", "affair", "ambition", "analyst", "apple", "assignment", "assistant", "bathroom", "bedroom", "beer", "birthday", "celebration", "championship", "cheek", "client", "consequence", "departure", "diamond", "dirt", "ear", "fortune", "friendship", "funeral", "gene", "girlfriend", "hat", "indication", "intention", "lady", "midnight", "negotiation", "obligation", "passenger", "pizza", "platform", "poet", "pollution", "recognition", "reputation", "shirt", "speaker", "stranger", "surgery", "sympathy", "tale", "throat", "trainer", "uncle", "youth", "time", "work", "film", "water", "money", "example", "while", "business", "study", "game", "life", "form", "air", "day", "place", "number", "part", "field", "fish", "back", "process", "heat", "hand", "experience", "job", "book", "end", "point", "type", "home", "economy", "value", "body", "market", "guide", "interest", "state", "radio", "course", "company", "price", "size", "card", "list", "mind", "trade", "line", "care", "group", "risk", "word", "fat", "force", "key", "light", "training", "name", "school", "top", "amount", "level", "order", "practice", "research", "sense", "service", "piece", "web", "boss", "sport", "fun", "house", "page", "term", "test", "answer", "sound", "focus", "matter", "kind", "soil", "board", "oil", "picture", "access", "garden", "range", "rate", "reason", "future", "site", "demand", "exercise", "image", "case", "cause", "coast", "action", "age", "bad", "boat", "record", "result", "section", "building", "mouse", "cash", "class", "period", "plan", "store", "tax", "side", "subject", "space", "rule", "stock", "weather", "chance", "figure", "man", "model", "source", "beginning", "earth", "program", "chicken", "design", "feature", "head", "material", "purpose", "question", "rock", "salt", "act", "birth", "car", "dog", "object", "scale", "sun", "note", "profit", "rent", "speed", "style", "war", "bank", "craft", "half", "inside", "outside", "standard", "bus", "exchange", "eye", "fire", "position", "pressure", "stress", "advantage", "benefit", "box", "frame", "issue", "step", "cycle", "face", "item", "metal", "paint", "review", "room", "screen", "structure", "view", "account", "ball", "discipline", "medium", "share", "balance", "bit", "black", "bottom", "choice", "gift", "impact", "machine", "shape", "tool", "wind", "address", "average", "career", "culture", "morning", "pot", "sign", "table", "task", "condition", "contact", "credit", "egg", "hope", "ice", "network", "north", "square", "attempt", "date", "effect", "link", "post", "star", "voice", "capital", "challenge", "friend", "self", "shot", "brush", "couple", "exit", "front", "function", "lack", "living", "plant", "plastic", "spot", "summer", "taste", "theme", "track", "wing", "brain", "button", "click", "desire", "foot", "gas", "influence", "notice", "rain", "wall", "base", "damage", "distance", "feeling", "pair", "savings", "staff", "sugar", "target", "text", "animal", "author", "budget", "discount", "file", "ground", "lesson", "minute", "officer", "phase", "reference", "register", "sky", "stage", "stick", "title", "trouble", "bowl", "bridge", "campaign", "character", "club", "edge", "evidence", "fan", "letter", "lock", "maximum", "novel", "option", "pack", "park", "quarter", "skin", "sort", "weight", "baby", "background", "carry", "dish", "factor", "fruit", "glass", "joint", "master", "muscle", "red", "strength", "traffic", "trip", "vegetable", "appeal", "chart", "gear", "ideal", "kitchen", "land", "log", "mother", "net", "party", "principle", "relative", "sale", "season", "signal", "spirit", "street", "tree", "wave", "belt", "bench", "commission", "copy", "drop", "minimum", "path", "progress", "project", "sea", "south", "status", "stuff", "ticket", "tour", "angle", "blue", "breakfast", "confidence", "daughter", "degree", "doctor", "dot", "dream", "duty", "essay", "father", "fee", "finance", "hour", "juice", "luck", "milk", "mouth", "peace", "pipe", "stable", "storm", "substance", "team", "trick", "afternoon", "bat", "beach", "blank", "catch", "chain", "consideration", "cream", "crew", "detail", "gold", "interview", "kid", "mark", "mission", "pain", "pleasure", "score", "screw", "sex", "shop", "shower", "suit", "tone", "window", "agent", "band", "bath", "block", "bone", "calendar", "candidate", "cap", "coat", "contest", "corner", "court", "cup", "district", "door", "east", "finger", "garage", "guarantee", "hole", "hook", "implement", "layer", "lecture", "lie", "manner", "meeting", "nose", "parking", "partner", "profile", "rice", "routine", "schedule", "swimming", "telephone", "tip", "winter", "airline", "bag", "battle", "bed", "bill", "bother", "cake", "code", "curve", "designer", "dimension", "dress", "ease", "emergency", "evening", "extension", "farm", "fight", "gap", "grade", "holiday", "horror", "horse", "host", "husband", "loan", "mistake", "mountain", "nail", "noise", "occasion", "package", "patient", "pause", "phrase", "proof", "race", "relief", "sand", "sentence", "shoulder", "smoke", "stomach", "string", "tourist", "towel", "vacation", "west", "wheel", "wine", "arm", "aside", "associate", "bet", "blow", "border", "branch", "breast", "brother", "buddy", "bunch", "chip", "coach", "cross", "document", "draft", "dust", "expert", "floor", "god", "golf", "habit", "iron", "judge", "knife", "landscape", "league", "mail", "mess", "native", "opening", "parent", "pattern", "pin", "pool", "pound", "request", "salary", "shame", "shelter", "shoe", "silver", "tackle", "tank", "trust", "assist", "bake", "bar", "bell", "bike", "blame", "boy", "brick", "chair", "closet", "clue", "collar", "comment", "conference", "devil", "diet", "fear", "fuel", "glove", "jacket", "lunch", "monitor", "mortgage", "nurse", "pace", "panic", "peak", "plane", "reward", "row", "sandwich", "shock", "spite", "spray", "surprise", "till", "transition", "weekend", "welcome", "yard", "alarm", "bend", "bicycle", "bite", "blind", "bottle", "cable", "candle", "clerk", "cloud", "concert", "counter", "flower", "grandfather", "harm", "knee", "lawyer", "leather", "load", "mirror", "neck", "pension", "plate", "purple", "ruin", "ship", "skirt", "slice", "snow", "specialist", "stroke", "switch", "trash", "tune", "zone", "anger", "award", "bid", "bitter", "boot", "bug", "camp", "candy", "carpet", "cat", "champion", "channel", "clock", "comfort", "cow", "crack", "engineer", "entrance", "fault", "grass", "guy", "hell", "highlight", "incident", "island", "joke", "jury", "leg", "lip", "mate", "motor", "nerve", "passage", "pen", "pride", "priest", "prize", "promise", "resident", "resort", "ring", "roof", "rope", "sail", "scheme", "script", "sock", "station", "toe", "tower", "truck", "witness", "can", "will", "other", "use", "make", "good", "look", "help", "go", "great", "being", "still", "public", "read", "keep", "start", "give", "human", "local", "general", "specific", "long", "play", "feel", "high", "put", "common", "set", "change", "simple", "past", "big", "possible", "particular", "major", "personal", "current", "national", "cut", "natural", "physical", "show", "try", "check", "second", "call", "move", "pay", "let", "increase", "single", "individual", "turn", "ask", "buy", "guard", "hold", "main", "offer", "potential", "professional", "international", "travel", "cook", "alternative", "special", "working", "whole", "dance", "excuse", "cold", "commercial", "low", "purchase", "deal", "primary", "worth", "fall", "necessary", "positive", "produce", "search", "present", "spend", "talk", "creative", "tell", "cost", "drive", "green", "support", "glad", "remove", "return", "run", "complex", "due", "effective", "middle", "regular", "reserve", "independent", "leave", "original", "reach", "rest", "serve", "watch", "beautiful", "charge", "active", "break", "negative", "safe", "stay", "visit", "visual", "affect", "cover", "report", "rise", "walk", "white", "junior", "pick", "unique", "classic", "final", "lift", "mix", "private", "stop", "teach", "western", "concern", "familiar", "fly", "official", "broad", "comfortable", "gain", "rich", "save", "stand", "young", "heavy", "lead", "listen", "valuable", "worry", "handle", "leading", "meet", "release", "sell", "finish", "normal", "press", "ride", "secret", "spread", "spring", "tough", "wait", "brown", "deep", "display", "flow", "hit", "objective", "shoot", "touch", "cancel", "chemical", "cry", "dump", "extreme", "push", "conflict", "eat", "fill", "formal", "jump", "kick", "opposite", "pass", "pitch", "remote", "total", "treat", "vast", "abuse", "beat", "burn", "deposit", "print", "raise", "sleep", "somewhere", "advance", "consist", "dark", "double", "draw", "equal", "fix", "hire", "internal", "join", "kill", "sensitive", "tap", "win", "attack", "claim", "constant", "drag", "drink", "guess", "minor", "pull", "raw", "soft", "solid", "wear", "weird", "wonder", "annual", "count", "dead", "doubt", "feed", "forever", "impress", "repeat", "round", "sing", "slide", "strip", "wish", "combine", "command", "dig", "divide", "equivalent", "hang", "hunt", "initial", "march", "mention", "spiritual", "survey", "tie", "adult", "brief", "crazy", "escape", "gather", "hate", "prior", "repair", "rough", "sad", "scratch", "sick", "strike", "employ", "external", "hurt", "illegal", "laugh", "lay", "mobile", "nasty", "ordinary", "respond", "royal", "senior", "split", "strain", "struggle", "swim", "train", "upper", "wash", "yellow", "convert", "crash", "dependent", "fold", "funny", "grab", "hide", "miss", "permit", "quote", "recover", "resolve", "roll", "sink", "slip", "spare", "suspect", "sweet", "swing", "twist", "upstairs", "usual", "abroad", "brave", "calm", "concentrate", "estimate", "grand", "male", "mine", "prompt", "quiet", "refuse", "regret", "reveal", "rush", "shake", "shift", "shine", "steal", "suck", "surround", "bear", "brilliant", "dare", "dear", "delay", "drunk", "female", "hurry", "inevitable", "invite", "kiss", "neat", "pop", "punch", "quit", "reply", "representative", "resist", "rip", "rub", "silly", "smile", "spell", "stretch", "stupid", "tear", "temporary", "tomorrow", "wake", "wrap", "yesterday", "Thomas", "Tom", "Lieuwe"];

    var name = capFirst(name1[getRandomInt(0, name1.length + 1)]) + ' ' + capFirst(name2[getRandomInt(0, name2.length + 1)]);
var uniq = [];
for(var t = 0; t < name.length; ++name){
    control = true;


for(var r = 0; r < uniq.length; ++r){
if(name[t] === uniq[r]){
    control = false;
    uniq[r][1]++;
    break;
}
    }

    if(control = true){
        uniq.push(name[t], 1);
    }
}


    return uniq;
}


//Generating custom relations 
function createCustomRel(selectedTable, childTable, parent_arr, child_arr, relationshipType, rel_query, ch_rel_query, manual_id, en_filter, en_prefix, pr_rel_prefix, ch_rel_prefix){
var arl = new ArrayUtil();

 var table = new GlideRecord(selectedTable);
    
 var chTable = new GlideRecord(childTable);
    
	
	if (manual_id == false){
	if (en_prefix == true){
	table.addQuery('name', 'STARTSWITH', pr_rel_prefix);
    table.query();
	chTable.addQuery('name', 'CONTAINS', ch_rel_prefix);
    chTable.query();
	}
	if (en_filter == true) {
	table.addQuery(rel_query);
	table.query;
	chTable.addQuery(ch_rel_query);
	chTable.query;
	}
	while (table.next()){
	var sysId = table.getUniqueValue();
	parent_arr.push(sysId);
	}
	while (chTable.next()){
	var chsysId = chTable.getUniqueValue();
	child_arr.push(chsysId);
	}
	}
	
var rel_ci = new GlideRecord("cmdb_rel_ci");

   var countChilds = child_arr.length;
    if (countChilds == 0) {
        return;
    }

    var j = 0;

    for (var g = 0; g < parent_arr.length; g++) {
        rel_ci.newRecord();
        rel_ci.parent = parent_arr[g];

        rel_ci.child = child_arr[j];

        if (j < countChilds - 1) {
            j += 1;
        } else {
            j = 0;
        }

        rel_ci.type = relationshipType;
        // rel_ci.setWorkflow(false);
        rel_ci.insert();
    }

}


//Main generative func
function executeRule(excludefield, genRecords, amount, prefix, type_of_array, PCF_mode, pop_index, c_fields, value, custom_IP, generatedIPs) {
    var arl = new ArrayUtil();
	arl.unique(c_fields); 
    var id_array = [];
	while (c_fields.length !== value.length) {
	value.push(value[0]); 
	}
    for (var i = 1; i <= amount; i++) {
        genRecords.newRecord();
        genRecords.short_description = type_of_array + ' demo insert №' + i;
		if (PCF_mode == true){
        c_fields.forEach(function(element){
		if (pop_index == true){		
		genRecords.setValue(element, value[arl.indexOf(c_fields, element)] + i);
		} else {
		genRecords.setValue(element, value[arl.indexOf(c_fields, element)]);
		}
		});
		}
        if (!arl.contains(excludefield, 'ip_address')) {
		    if (custom_IP == false) {
            var ip = (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255));
            genRecords.setValue('ip_address', ip);
			} else {
			//Population of random IP Adress from selected range of IP's per record in Generation
			var randomIndex = Math.floor(Math.random() * generatedIPs.length);            
			genRecords.setValue('ip_address', generatedIPs[randomIndex]);
			}
        }

        if (!arl.contains(excludefield, 'name')) {
            genRecords.setValue('name', prefix + i);
        }

        if (!arl.contains(excludefield, 'host_name')) {
            if(arguments.unique(name1)){
            genRecords.setValue('host_name', generateName());
            }
        }

        if (!arl.contains(excludefield, 'mac_address')) {
            genRecords.setValue('mac_address', genMAC());
        }

        id_array.push(genRecords.insert());
    }
    return id_array;
}

function createRelationships(list_of_parents, list_of_child, relationshipType) {
    var rel_ci = new GlideRecord("cmdb_rel_ci");

    for (var g = 0; g < list_of_parents.length; g++) {
        rel_ci.newRecord();
        rel_ci.parent = list_of_parents[g];
        rel_ci.child = list_of_child[g];
        rel_ci.type = relationshipType;
        // rel_ci.setWorkflow(false);
        rel_ci.insert();
    }
}

//Random by random relation generation
function generateRanRelationships(list_of_parents, list_of_child, minRelationships, maxRelationships, relationshipType) {
    if (!list_of_parents || !Array.isArray(list_of_parents) || !list_of_child || !Array.isArray(list_of_child)) {
        gs.log('Invalid input: Expecting arrays for list_of_parents and list_of_child.');
        return;
    }

    var rel_ci = new GlideRecord('cmdb_rel_ci');
    for (var i = 0; i < list_of_parents.length; i++) {
        var numRelationships = Math.floor(Math.random() * (maxRelationships - minRelationships + 1)) + minRelationships;
        for (var j = 0; j < numRelationships; j++) {
            var randomChildIndex = Math.floor(Math.random() * list_of_child.length);
            rel_ci.initialize();
            rel_ci.parent = list_of_parents[i];
            rel_ci.child = list_of_child[randomChildIndex];
            rel_ci.type = relationshipType;
            try {
                rel_ci.insert();
            } catch (e) {
                gs.log('Error inserting relationship:', e);
            }
        }
    }
}


// Lvl Generation relationships 
function generateHierarchicalRelationships(list_of_parents, list_of_child, relationshipType, maxLevels) {

    var rel_ci = new GlideRecord('cmdb_rel_ci');
    for (var i = 0; i < list_of_parents.length; i++) {
        var currentTable = list_of_parents[i];
        var numLevels = Math.floor(Math.random() * maxLevels) + 1; // Random number of levels for each table

        for (var j = 1; j <= numLevels; j++) {
            var childTableIndex = (i + j) % list_of_child.length;            

            rel_ci.newRecord();
            rel_ci.parent = currentTable;
            rel_ci.child = list_of_child[childTableIndex];
            rel_ci.type = relationshipType;
            rel_ci.insert();
        }
    }
}

//deleter by prefix
function deleteRecordsByPrefix(selectedTable, childTable, del_prefix) {

    var table = new GlideRecord(selectedTable);
    table.addQuery('name', 'STARTSWITH', del_prefix);
    table.deleteMultiple();

    var chTable = new GlideRecord(childTable);
    chTable.addQuery('name', 'CONTAINS', del_prefix);
    chTable.deleteMultiple();
}

// deleter by selected filter
function deleteRecordsByFilter(selectedTable, ciFilter) {
    var recordsToDelete = new GlideRecord(selectedTable);
    recordsToDelete.addQuery(ciFilter);
    recordsToDelete.query();

    while (recordsToDelete.next()) {
        recordsToDelete.deleteRecord();
    }

    gs.info('Deleted records via ' + ciFilter + ' from ' + selectedTable);
}

// Generating custom IP ADRESS in selected range
function generateIPAddresses(startRange, endRange) {
  var ipAddresses = [];

  // Convert IP range strings to arrays
  var startIPArray = startRange.split('.');
  var endIPArray = endRange.split('.');

  // Convert IP arrays to numbers
  var startIP = startIPArray.map(function(num) {
    return parseInt(num, 10);
  });
  var endIP = endIPArray.map(function(num) {
    return parseInt(num, 10);
  });

  // Iterate over IP range
  while (!compareIP(startIP, endIP)) {
    ipAddresses.push(startIP.join('.'));
    incrementIP(startIP);
  }

  return ipAddresses;
}

function compareIP(ip1, ip2) {
  for (var i = 0; i < 4; i++) {
    if (ip1[i] < ip2[i]) return false;
    if (ip1[i] > ip2[i]) return true;
  }
  return true;
}

function incrementIP(ip) {
  for (var i = 3; i >= 0; i--) {
    if (ip[i] < 255) {
      ip[i]++;
      break;
    } else {
      ip[i] = 0;
    }
  }
}

function populateFields(table, recordPrefix, field, fieldType, strValuePrefix, choices) {
    var gr = new GlideRecord(table);
    var queryString = "nameSTARTSWITH" + recordPrefix;
    gr.addEncodedQuery(queryString);
    gr.query();

    var i = 1;
    while (gr.next()) {
        switch (fieldType) {
            case FieldType.String:
                var strValue = strValuePrefix + i;
                gr.setValue(field, strValue);
                break;

            case FieldType.Choice:
                var index = (i - 1) % choices.length;
                var choiceValue = choices[index];
                gr.setValue(field, choiceValue);
                break;

            case FieldType.Integer:
                var intValue = i;
                gr.setValue(field, intValue);
                break;

            case FieldType.Boolean:
                var boolValue = i % 2 == true;
                gr.setValue(field, boolValue);
                break;
        }

        gr.setWorkflow(false);
        gr.update();

        i += 1;
    }
    gs.info(i - 1); // Logging the number of records updated
}


































let start = false;
 
for (let j = 0; j < Arr.length; j++) {
    for (let k = 0; k < outputArray.length; k++) {
        if (Arr[j] == outputArray[k]) {
            start = true;
        }
    }
    count++;
    if (count == 1 && start == false) {
        outputArray.push(Arr[j]);
    }
    start = false;
    count = 0;
}




////

//my vertion

var count = 0;
var control = true;
var Uniq = [];

for(var r = 0; r < this.name.length; r++){
    for(var f = 0; h < Uniq; f++){
if(this.name[r] == Uniq[f]){
control = false;
}
    }
count++;

if(count = 1 && control == true){
    Uniq.push(this.name[r]);
}

}