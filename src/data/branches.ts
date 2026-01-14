export type BranchHours = {
    open: string;
    close: string;
};

export type WeeklyHours = {
    Monday: BranchHours | null;
    Tuesday: BranchHours | null;
    Wednesday: BranchHours | null;
    Thursday: BranchHours | null;
    Friday: BranchHours | null;
    Saturday: BranchHours | null;
    Sunday: BranchHours | null;
};

export type RoomData = {
    id: string;
    name: string;
    capacity: number;
};

export type BranchData = {
    id: string;
    name: string;
    address: string;
    hours: WeeklyHours;
    rooms: RoomData[];
};

// --- DATA HELPERS ---

const h = (open: string, close: string): BranchHours => ({ open, close });
const c = null; // Closed

// Standard TPL: M-F 9-8:30, Sat 9-5, Sun 12-5
const std = {
    Monday: h("09:00", "20:30"),
    Tuesday: h("09:00", "20:30"),
    Wednesday: h("09:00", "20:30"),
    Thursday: h("09:00", "20:30"),
    Friday: h("09:00", "20:30"),
    Saturday: h("09:00", "17:00"),
    Sunday: h("12:00", "17:00"),
};

// 10-8:30 pattern (many smaller branches)
// Mon 10-8:30, Tue 12:30-8:30, Wed 10-6, Thu 12:30-8:30, Fri 10-6, Sat 9-5, Sun 12-5
const tier2 = {
    Monday: h("10:00", "20:30"),
    Tuesday: h("12:30", "20:30"),
    Wednesday: h("10:00", "18:00"),
    Thursday: h("12:30", "20:30"),
    Friday: h("10:00", "18:00"),
    Saturday: h("09:00", "17:00"),
    Sunday: h("12:00", "17:00"),
};

// Helper for manual hours
const manual = (m: string | null, t: string | null, w: string | null, th: string | null, f: string | null, sa: string | null, su: string | null): WeeklyHours => {
    const p = (s: string | null) => s ? { open: s.split('-')[0], close: s.split('-')[1] } : null;
    return { Monday: p(m), Tuesday: p(t), Wednesday: p(w), Thursday: p(th), Friday: p(f), Saturday: p(sa), Sunday: p(su) };
};

// CLOSED Branch
const closedBranch: WeeklyHours = {
    Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null, Saturday: null, Sunday: null
};


// --- ROOM CONFIGURATIONS ---

const ALBION_ROOMS: RoomData[] = [
    { id: "alb-a", name: "Study Room A", capacity: 4 },
    { id: "alb-b", name: "Study Room B", capacity: 4 },
    { id: "alb-c", name: "Study Room C", capacity: 4 },
    { id: "alb-d", name: "Study Room D", capacity: 4 },
    { id: "alb-e", name: "Study Room E", capacity: 4 },
    { id: "alb-f", name: "Study Room F", capacity: 4 },
];

const STD_4_ROOMS: RoomData[] = [
    { id: "r-1", name: "Study Room 1", capacity: 4 },
    { id: "r-2", name: "Study Room 2", capacity: 4 },
    { id: "r-3", name: "Study Room 3", capacity: 4 },
    { id: "r-4", name: "Study Room 4", capacity: 4 },
];

const TRL_ROOMS: RoomData[] = [
    { id: "trl-1f-1", name: "Room 1 (1st Fl)", capacity: 6 },
    { id: "trl-1f-2", name: "Room 2 (1st Fl)", capacity: 6 },
    { id: "trl-1f-3", name: "Room 3 (1st Fl)", capacity: 2 },
    { id: "trl-1f-4", name: "Room 4 (1st Fl)", capacity: 2 },
    { id: "trl-2f-grp", name: "Group Room (2nd Fl)", capacity: 6 },
    { id: "trl-2f-pod1", name: "Pod 1 (2nd Fl)", capacity: 2 },
    { id: "trl-2f-pod2", name: "Pod 2 (2nd Fl)", capacity: 2 },
    { id: "trl-2f-pod3", name: "Pod 3 (2nd Fl)", capacity: 2 },
    { id: "trl-2f-pod4", name: "Pod 4 (2nd Fl)", capacity: 2 },
    { id: "trl-2f-pod5", name: "Pod 5 (2nd Fl)", capacity: 2 },
    { id: "trl-3f-pod1", name: "Pod 1 (3rd Fl)", capacity: 2 },
    { id: "trl-3f-pod2", name: "Pod 2 (3rd Fl)", capacity: 2 },
    { id: "trl-3f-pod3", name: "Pod 3 (3rd Fl)", capacity: 2 },
    { id: "trl-3f-pod4", name: "Pod 4 (3rd Fl)", capacity: 2 },
    { id: "trl-3f-pod5", name: "Pod 5 (3rd Fl)", capacity: 2 },
    { id: "trl-4f-pod1", name: "Pod 1 (4th Fl)", capacity: 2 },
    { id: "trl-4f-pod2", name: "Pod 2 (4th Fl)", capacity: 2 },
    { id: "trl-4f-pod3", name: "Pod 3 (4th Fl)", capacity: 2 },
    { id: "trl-4f-pod4", name: "Pod 4 (4th Fl)", capacity: 2 },
    { id: "trl-4f-pod5", name: "Pod 5 (4th Fl)", capacity: 2 },
];

const NYCL_ROOMS: RoomData[] = [
    { id: "nycl-2f-1", name: "Room 1 (2nd Fl)", capacity: 4 },
    { id: "nycl-2f-2", name: "Room 2 (2nd Fl)", capacity: 4 },
    { id: "nycl-3f-1", name: "Room 1 (3rd Fl)", capacity: 8 },
    { id: "nycl-3f-2", name: "Room 2 (3rd Fl)", capacity: 8 },
    { id: "nycl-3f-3", name: "Room 3 (3rd Fl)", capacity: 8 },
    { id: "nycl-3f-4", name: "Room 4 (3rd Fl)", capacity: 8 },
    { id: "nycl-4f-1", name: "Room 1 (4th Fl)", capacity: 10 },
    { id: "nycl-4f-2", name: "Room 2 (4th Fl)", capacity: 10 },
    { id: "nycl-4f-3", name: "Room 3 (4th Fl)", capacity: 10 },
    { id: "nycl-4f-4", name: "Room 4 (4th Fl)", capacity: 10 },
    { id: "nycl-4f-5", name: "Room 5 (4th Fl)", capacity: 10 },
    { id: "nycl-4f-6", name: "Room 6 (4th Fl)", capacity: 10 },
    { id: "nycl-4f-7", name: "Room 7 (4th Fl)", capacity: 10 },
    { id: "nycl-4f-8", name: "Room 8 (4th Fl)", capacity: 10 },
    { id: "nycl-booth-3f", name: "Study Booths (3rd Fl)", capacity: 1 },
    { id: "nycl-booth-4f", name: "Study Booths (4th Fl)", capacity: 1 },
];


// --- ALPHABETICAL BRANCH LIST ---

export const BRANCH_DATA: BranchData[] = [
    {
        id: "agincourt",
        name: "Agincourt",
        address: "155 Bonis Avenue",
        hours: std,
        rooms: []
    },
    {
        id: "albert-campbell",
        name: "Albert Campbell",
        address: "496 Birchmount Road",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "albion",
        name: "Albion",
        address: "1515 Albion Road",
        hours: std,
        rooms: ALBION_ROOMS
    },
    {
        id: "alderwood",
        name: "Alderwood",
        address: "2 Orianna Drive",
        hours: manual("10:00-20:30", "10:00-18:00", "10:00-18:00", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "amesbury-park",
        name: "Amesbury Park",
        address: "1565 Lawrence Avenue West",
        hours: tier2,
        rooms: []
    },
    {
        id: "annette-street",
        name: "Annette Street",
        address: "145 Annette Street",
        hours: tier2,
        rooms: []
    },
    {
        id: "armour-heights",
        name: "Armour Heights",
        address: "2140 Avenue Road",
        hours: tier2,
        rooms: []
    },
    {
        id: "barbara-frum",
        name: "Barbara Frum",
        address: "20 Covington Road",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "beaches",
        name: "Beaches",
        address: "2161 Queen Street East",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "bendale",
        name: "Bendale",
        address: "1515 Danforth Road",
        hours: tier2,
        rooms: []
    },
    {
        id: "black-creek",
        name: "Black Creek",
        address: "1700 Wilson Avenue",
        hours: manual("09:00-20:00", "09:00-20:00", "09:00-20:00", "09:00-20:00", "09:00-20:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "bloor-gladstone",
        name: "Bloor/Gladstone",
        address: "1101 Bloor Street West",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "brentwood",
        name: "Brentwood",
        address: "36 Brentwood Road North",
        hours: std,
        rooms: []
    },
    {
        id: "bridlewood",
        name: "Bridlewood",
        address: "2900 Warden Avenue",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "brookbanks",
        name: "Brookbanks",
        address: "210 Brookbanks Drive",
        hours: tier2,
        rooms: []
    },
    {
        id: "burrows-hall",
        name: "Burrows Hall",
        address: "1081 Progress Avenue",
        hours: std,
        rooms: []
    },
    {
        id: "cedarbrae",
        name: "Cedarbrae",
        address: "545 Markham Road",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "centennial",
        name: "Centennial",
        address: "578 Finch Avenue West",
        hours: closedBranch,
        rooms: []
    },
    {
        id: "city-hall",
        name: "City Hall",
        address: "100 Queen Street West",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "cliffcrest",
        name: "Cliffcrest",
        address: "3017 Kingston Road",
        hours: std,
        rooms: []
    },
    {
        id: "college-shaw",
        name: "College/Shaw",
        address: "766 College Street",
        hours: tier2,
        rooms: []
    },
    {
        id: "danforth-coxwell",
        name: "Danforth/Coxwell",
        address: "1675 Danforth Avenue",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "daniel-g-hill",
        name: "Daniel G. Hill",
        address: "620 Jane Street",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "davenport",
        name: "Davenport",
        address: "1246 Shaw Street",
        hours: manual(null, "12:30-20:30", "10:00-18:00", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "dawes-road",
        name: "Dawes Road",
        address: "416 Dawes Road",
        hours: closedBranch,
        rooms: []
    },
    {
        id: "deer-park",
        name: "Deer Park",
        address: "40 St. Clair Avenue East",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "don-mills",
        name: "Don Mills",
        address: "888 Lawrence Avenue East",
        hours: std,
        rooms: []
    },
    {
        id: "downsview",
        name: "Downsview",
        address: "2793 Keele Street",
        hours: std,
        rooms: []
    },
    {
        id: "dufferin-st-clair",
        name: "Dufferin/St. Clair",
        address: "1625 Dufferin Street",
        hours: tier2,
        rooms: []
    },
    {
        id: "eatonville",
        name: "Eatonville",
        address: "430 Burnhamthorpe Road",
        hours: std,
        rooms: []
    },
    {
        id: "eglinton-square",
        name: "Eglinton Square",
        address: "1 Eglinton Square",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: STD_4_ROOMS
    },
    {
        id: "elmbrook-park",
        name: "Elmbrook Park",
        address: "2 Elmbrook Crescent",
        hours: manual(null, "10:00-18:00", "12:30-20:30", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "ethennonnhawahstihnen",
        name: "Ethennonnhawahstihnen'",
        address: "100 Ethennonnhawahstihnen' Ln.",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: STD_4_ROOMS
    },
    {
        id: "evelyn-gregory",
        name: "Evelyn Gregory",
        address: "120 Trowell Avenue",
        hours: tier2,
        rooms: []
    },
    {
        id: "fairview",
        name: "Fairview",
        address: "35 Fairview Mall Drive",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "flemingdon-park",
        name: "Flemingdon Park",
        address: "29 St. Dennis Drive",
        hours: closedBranch,
        rooms: []
    },
    {
        id: "forest-hill",
        name: "Forest Hill",
        address: "700 Eglinton Avenue West",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "fort-york",
        name: "Fort York",
        address: "190 Fort York Boulevard",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "gerrard-ashdale",
        name: "Gerrard/Ashdale",
        address: "1432 Gerrard Street East",
        hours: tier2,
        rooms: []
    },
    {
        id: "goldhawk-park",
        name: "Goldhawk Park",
        address: "295 Alton Towers Circle",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "guildwood",
        name: "Guildwood",
        address: "123 Guildwood Parkway",
        hours: manual(null, "12:30-20:30", "10:00-18:00", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "high-park",
        name: "High Park",
        address: "228 Roncesvalles Avenue",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "highland-creek",
        name: "Highland Creek",
        address: "3550 Ellesmere Road",
        hours: manual(null, "12:30-20:30", "10:00-18:00", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "hillcrest",
        name: "Hillcrest",
        address: "5801 Leslie Street",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "humber-bay",
        name: "Humber Bay",
        address: "200 Park Lawn Road",
        hours: manual(null, "10:00-18:00", "12:30-20:30", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "humber-summit",
        name: "Humber Summit",
        address: "2990 Islington Avenue",
        hours: tier2,
        rooms: []
    },
    {
        id: "humberwood",
        name: "Humberwood",
        address: "850 Humberwood Boulevard",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "jane-sheppard",
        name: "Jane/Sheppard",
        address: "1906 Sheppard Avenue West",
        hours: std,
        rooms: []
    },
    {
        id: "jones",
        name: "Jones",
        address: "118 Jones Avenue",
        hours: manual("10:00-18:00", "10:00-20:30", "12:30-20:30", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "junction-triangle",
        name: "Junction Triangle",
        address: "305 Campbell Avenue",
        hours: tier2,
        rooms: STD_4_ROOMS
    },
    {
        id: "kennedy-eglinton",
        name: "Kennedy/Eglinton",
        address: "2380 Eglinton Avenue East",
        hours: std,
        rooms: []
    },
    {
        id: "leaside",
        name: "Leaside",
        address: "165 McRae Drive",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "lillian-h-smith",
        name: "Lillian H. Smith",
        address: "239 College Street",
        hours: std,
        rooms: []
    },
    {
        id: "locke",
        name: "Locke",
        address: "3083 Yonge Street",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "long-branch",
        name: "Long Branch",
        address: "3500 Lake Shore Boulevard West",
        hours: manual(null, "12:30-20:30", "10:00-18:00", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "main-street",
        name: "Main Street",
        address: "137 Main Street",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "malvern",
        name: "Malvern",
        address: "30 Sewells Road",
        hours: std,
        rooms: []
    },
    {
        id: "maria-a-shchuka",
        name: "Maria A. Shchuka",
        address: "1745 Eglinton Avenue West",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "maryvale",
        name: "Maryvale",
        address: "85 Ellesmere Road",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "mcgregor-park",
        name: "McGregor Park",
        address: "2219 Lawrence Avenue East",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "merril-collection",
        name: "Merril Collection",
        address: "239 College Street",
        hours: std,
        rooms: []
    },
    {
        id: "mimico-centennial",
        name: "Mimico Centennial",
        address: "47 Station Road",
        hours: tier2,
        rooms: []
    },
    {
        id: "morningside",
        name: "Morningside",
        address: "4279 Lawrence Avenue East",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: STD_4_ROOMS
    },
    {
        id: "mount-dennis",
        name: "Mount Dennis",
        address: "1123 Weston Road",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "mount-pleasant",
        name: "Mount Pleasant",
        address: "599 Mt. Pleasant Road",
        hours: manual(null, "12:30-20:30", "10:00-18:00", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "new-toronto",
        name: "New Toronto",
        address: "110 Eleventh Street",
        hours: manual(null, "10:00-18:00", "12:30-20:30", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "nycl",
        name: "North York Central Library",
        address: "5120 Yonge Street",
        hours: std,
        rooms: NYCL_ROOMS
    },
    {
        id: "northern-district",
        name: "Northern District",
        address: "40 Orchard View Boulevard",
        hours: std,
        rooms: []
    },
    {
        id: "northern-elms",
        name: "Northern Elms",
        address: "123B Rexdale Boulevard",
        hours: tier2,
        rooms: []
    },
    {
        id: "oakwood-village",
        name: "Oakwood Village",
        address: "341 Oakwood Avenue",
        hours: tier2,
        rooms: []
    },
    {
        id: "osborne-collection",
        name: "Osborne Collection",
        address: "239 College Street",
        hours: std,
        rooms: []
    },
    {
        id: "palmerston",
        name: "Palmerston",
        address: "560 Palmerston Avenue",
        hours: tier2,
        rooms: []
    },
    {
        id: "pape-danforth",
        name: "Pape/Danforth",
        address: "701 Pape Avenue",
        hours: std,
        rooms: []
    },
    {
        id: "parkdale",
        name: "Parkdale",
        address: "1303 Queen Street West",
        hours: std,
        rooms: []
    },
    {
        id: "parliament-street",
        name: "Parliament Street",
        address: "269 Gerrard Street East",
        hours: std,
        rooms: []
    },
    {
        id: "pleasant-view",
        name: "Pleasant View",
        address: "575 Van Horne Avenue",
        hours: closedBranch,
        rooms: []
    },
    {
        id: "port-union",
        name: "Port Union",
        address: "5450 Lawrence Avenue East",
        hours: tier2,
        rooms: []
    },
    {
        id: "queen-saulter",
        name: "Queen/Saulter",
        address: "765 Queen Street East",
        hours: tier2,
        rooms: []
    },
    {
        id: "rexdale",
        name: "Rexdale",
        address: "2243 Kipling Avenue",
        hours: tier2,
        rooms: []
    },
    {
        id: "richview",
        name: "Richview",
        address: "1806 Islington Avenue",
        hours: std,
        rooms: []
    },
    {
        id: "riverdale",
        name: "Riverdale",
        address: "370 Broadview Avenue",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "runnymede",
        name: "Runnymede",
        address: "2178 Bloor Street West",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "s-walter-stewart",
        name: "S. Walter Stewart",
        address: "170 Memorial Park Avenue",
        hours: std,
        rooms: []
    },
    {
        id: "sanderson",
        name: "Sanderson",
        address: "327 Bathurst Street",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "scarborough-civic-centre",
        name: "Scarborough Civic Centre",
        address: "156 Borough Drive",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "spadina-road",
        name: "Spadina Road",
        address: "10 Spadina Road",
        hours: tier2,
        rooms: []
    },
    {
        id: "st-clair-silverthorn",
        name: "St. Clair/Silverthorn",
        address: "1748 St. Clair Avenue West",
        hours: tier2,
        rooms: []
    },
    {
        id: "st-james-town",
        name: "St. James Town",
        address: "495 Sherbourne Street",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "st-lawrence",
        name: "St. Lawrence",
        address: "171 Front Street East",
        hours: tier2,
        rooms: []
    },
    {
        id: "steeles",
        name: "Steeles",
        address: "375 Bamburgh Circle",
        hours: std,
        rooms: []
    },
    {
        id: "swansea-memorial",
        name: "Swansea Memorial",
        address: "95 Lavinia Avenue",
        hours: manual("13:30-18:00", "13:30-18:00", "13:30-18:00", "13:30-18:00", "13:30-18:00", "09:30-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "taylor-memorial",
        name: "Taylor Memorial",
        address: "1440 Kingston Road",
        hours: manual(null, "12:30-20:30", "10:00-18:00", "12:30-20:30", "10:00-18:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "thorncliffe",
        name: "Thorncliffe",
        address: "48 Thorncliffe Park Drive",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "todmorden-room",
        name: "Todmorden Room",
        address: "1081 1/2 Pape Avenue",
        hours: manual(null, "12:30-20:30", "09:00-17:00", "12:30-20:30", null, "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "trl",
        name: "Toronto Reference Library",
        address: "789 Yonge Street",
        hours: std,
        rooms: TRL_ROOMS
    },
    {
        id: "victoria-village",
        name: "Victoria Village",
        address: "184 Sloane Avenue",
        hours: tier2,
        rooms: []
    },
    {
        id: "weston",
        name: "Weston",
        address: "2 King Street",
        hours: std,
        rooms: []
    },
    {
        id: "woodside-square",
        name: "Woodside Square",
        address: "1571 Sandhurst Circle",
        hours: std,
        rooms: []
    },
    {
        id: "woodview-park",
        name: "Woodview Park",
        address: "16 Bradstock Road",
        hours: tier2,
        rooms: STD_4_ROOMS
    },
    {
        id: "wychwood",
        name: "Wychwood",
        address: "1431 Bathurst Street",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    },
    {
        id: "york-woods",
        name: "York Woods",
        address: "1785 Finch Avenue West",
        hours: std,
        rooms: STD_4_ROOMS
    },
    {
        id: "yorkville",
        name: "Yorkville",
        address: "22 Yorkville Avenue",
        hours: manual("09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-20:30", "09:00-17:00", "09:00-17:00", "12:00-17:00"),
        rooms: []
    }
];
