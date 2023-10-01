
export const CURRENT_NAV_ITEM = "currentNavItem";

export const URL_PREFIX = "http://192.168.1.20:8080/"

export const ACCESS_TOKEN = "actk"
export const REFRESH_TOKEN = "rftk"
export const LOCAL_USER = "currentUser"
export const LOCAL_WS = "localWs"
export const CURRENT_NOTE = "currentNote"
export const CURRENT_WS = "CURRENT_WS"
export const CURRENT_PERCENT = "currentPercent"
export const CHECK_TYPE = "CHECK"
export const NOTE_TYPE = "NOTE"
export const SORT_ITEMS = "sort_items"
export const SORT_TASK_ITEMS = "sort_task_items"
export const SORT_WS_ITEMS = "sort_ws_items"
export const SELECTED_SORT = "selected_sort"
export const SELECTED_TASK_SORT = "selected_task_sort"
export const WS_SELECTED_SORT = "ws_selected_sort"
export const ACTIVATE_EMAIL = "activate_email"
export const AUTO_SEND = "auto_send"
export const AUTO_SEND_RECOVERY = "auto_send_recovery"

export const EXPAND_SIDEBAR = "expand_sidebar"
export const HOMEPAGE_ANALYTICS = "homepage_analytics"
export const DETAILPAGE_ANALYTICS = "detailpage_analytics"
export const IS_REMEMBER = "isRememberMe"
export const USERNAME_LOCAL = "uname_local"

export const SUCCESS_RESULT = "SUCCESS"

export const DISPLAY_TYPE = "ws_display_type"
export const GRID = "grid"
export const COLS = "cols"

export const CURRENT_NOTE_PAGE = "current_note_page"
export const CURRENT_TASK_PAGE = "current_task_page"
export const CURRENT_WS_PAGE = "current_ws_page"
export const SELECTED_LANG = "selected_lang"
export const VI = "vi"
export const EN = "en"
export const ZH = "zh"

export const LOCALES = [
    {code:"vi",title:"Tiếng Việt", icon:"../assets/images/vie_lang.png"},
    {code:"en",title:"English", icon:"../assets/images/eng_lang.png"},
    {code:"zh",title:"汉语", icon:"../assets/images/zh_lang.png"}
]


export const SORTS = [
    {"name":'sorts.last_updated_desc',"value":"updated_at_desc"},
    {"name":'sorts.last_updated_asc',"value":"updated_at_asc"},
    {"name":'sorts.created_desc',"value":"created_at_desc"},
    {"name":'sorts.created_asc',"value":"created_at_asc"},
    {"name":'sorts.alphabet_a-z',"value":"a_z"},
    {"name":'sorts.alphabet_z-a',"value":"z_a"},
    {"name":'sorts.finished_desc',"value":"done_last_updated_asc"},
    {"name":'sorts.finished_asc',"value":"done_last_updated_desc"},
    {"name":'sorts.favorite_desc',"value":"favorite_desc"},
    {"name":'sorts.favorite_asc',"value":"favorite_asc"}
]

