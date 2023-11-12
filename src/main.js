// Spread Sheet
const SHEET_NAME = "シート1";

// Slack
const sendUrl = "https://slack.com/api/users.profile.set";
const DEFAULT_SET = {
  status_emoji: ":nemunemu_nyanko_paradaisu:",
  status_text: "ねむねむにゃんこパラダイス"
}


const getProperty = (key) => {
  return PropertiesService.getScriptProperties().getProperty(key);
}

const sendRequest = (method, url, payload) => {
  // payload["token"] = 
  const headers = {
    'Authorization': 'Bearer ' + getProperty("SLACK_TOKEN"),
    'Content-Type': 'application/json; charset=utf-8'
  };
  const params = {
    method: method,
    payload: JSON.stringify(payload),
    headers: headers
  };
  const response = UrlFetchApp.fetch(url, params);
  return JSON.parse(response.getContentText());
}

const apiTest = () => {
  Logger.log(sendRequest("GET", "https://slack.com/api/users.profile.get", {}));
}

const updateStatus = () => {
  // カレンダーから現在のステータスを取得する
  const calendar = CalendarApp.getCalendarById(getProperty("CALENDAR_ID"));
  const eventList = calendar.getEventsForDay(new Date());
  // 複数ある場合は1つ目のタイトルを取る。ない場合はnullにセットする
  let statusKey = null;
  if (eventList.length > 0) {
    statusKey = eventList[0].getTitle();
  }
  // Logger.log(statusKey);
  // スプシからステータスのリストを取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const statusDict = sheet.getRange("A2:C100").getValues().reduce((res, row) => {
    if (row.includes("")) {
      // 行が埋まっていない場合はスキップ
      return res;
    }
    res[row[0]] = {
      status_emoji: ":" + row[1] + ":",
      status_text: row[2]
    };
    return res;
  }, {});
  // Logger.log(statusDict);
  // 該当するステータスがあればそれに、なければ「ねむねむにゃんこパラダイス」にする
  let status = DEFAULT_SET;
  if (statusKey in statusDict) {
    status = statusDict[statusKey];
  }
  // status["status_expiration"] = 0;
  // 更新する
  Logger.log({ profile: status });
  const response = sendRequest("POST", sendUrl, { profile: status });
  Logger.log(response);
}
