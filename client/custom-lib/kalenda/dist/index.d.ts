enum CALENDAR_VIEW {
    AGENDA = "agenda",
    WEEK = "week",
    DAY = "day",
    THREE_DAYS = "threeDays",
    MONTH = "month"
}
export interface CalendarEvent {
    id: any;
    startAt: string;
    endAt: string;
    timezoneStartAt: string;
    timezoneEndAt: string;
    summary: string;
    color: string;
    internalID?: string;
    [key: string]: any;
}
interface NewEventClickData {
    event: any;
    day: Date;
    hour: number;
}
interface PageChangeData {
    rangeFrom: string;
    rangeTo: string;
    direction: string;
}
type OnPageChangeFunc = (data: PageChangeData) => void;
type ShowMoreMonthFunc = (data: CalendarEvent[]) => void;
type OnSelectViewFunc = (view: CALENDAR_VIEW) => void;
type OnEventClickFunc = (data: CalendarEvent) => void;
type OnEventDragFinishFunc = (prevEvent: CalendarEvent, updatedEvent: CalendarEvent, events: any) => void;
type OnNewEventClickFunc = (data: NewEventClickData) => void;
interface Style {
    primaryColor: string;
    baseColor: string;
    inverseBaseColor: string;
}
export const CalendarView: typeof CALENDAR_VIEW;
export type OnEventClickData = CalendarEvent;
export type OnNewEventClickData = NewEventClickData;
export type OnPageChangeData = PageChangeData;
export type OnSelectViewData = CALENDAR_VIEW;
export type ShowMoreMonthData = CalendarEvent[];
export type OnEventDragFinish = OnEventDragFinishFunc;
export const getNewCalendarDaysHelper: (calendarDays: import("luxon").DateTime[], calendarView: CALENDAR_VIEW, direction: import("common/enums").CALENDAR_NAVIGATION_DIRECTION, weekDayStart: import("common/enums").WEEKDAY_START, dispatchContext?: any) => import("luxon").DateTime[];
export interface KalendProps {
    initialDate?: string;
    initialView?: CALENDAR_VIEW;
    selectedView?: CALENDAR_VIEW;
    disabledViews?: CALENDAR_VIEW[];
    events?: any;
    isDark?: boolean;
    showTimeLine?: boolean;
    hourHeight?: number;
    onNewEventClick?: OnNewEventClickFunc;
    onEventClick?: OnEventClickFunc;
    onSelectView?: OnSelectViewFunc;
    showMoreMonth?: ShowMoreMonthFunc;
    onPageChange?: OnPageChangeFunc;
    onEventDragFinish?: OnEventDragFinishFunc;
    onStateChange?: any;
    disableMobileDropdown?: boolean;
    timezone?: string;
    weekDayStart?: string;
    timeFormat?: string;
    calendarIDsHidden?: string[];
    children?: any;
    language?: string;
    customLanguage?: any;
    eventLayouts?: any;
    kalendRef?: any;
    style?: Style;
}
declare const Kalend: (props: KalendProps) => JSX.Element;
export default Kalend;

//# sourceMappingURL=index.d.ts.map
