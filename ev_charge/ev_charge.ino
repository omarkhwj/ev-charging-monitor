#include <ESP8266WiFi.h>
#include <DNSServer.h>            //Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     //Local WebServer used to serve the configuration portal
#include <WiFiManager.h>    //https://github.com/tzapu/WiFiManager WiFi Configuration Magic
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>

#define CURRENT_THRESHOLD 10
#define ACTIVITY_THRESHOLD 2
#define SERVER_ADDRESS "http://192.168.1.2:3015/deviceSessions/"

HTTPClient http;
WiFiClient client;

String macJson = "";

unsigned long activeTime = 0;
unsigned long idleTime = 0;
uint32_t currentReading = 0;
bool sessionActive = false;
String sessionId = "";

String requestBody = "";
String responseBody = "";

void clearBodies() {
  requestBody = "";
  responseBody = "";
}

void startSession() {
  clearBodies();

  http.begin(client, SERVER_ADDRESS); //HTTP
  http.addHeader("Content-Type", "application/json");

  while (http.POST(macJson) != 200);
  sessionActive = true;
  sessionId = http.getString();
  sessionId = sessionId.substring(1, sessionId.length() - 1);
  Serial.println("Session ID: " + sessionId);

}

void pushData() {
  clearBodies();

  StaticJsonDocument<100> doc;
  doc["data"] = currentReading;
  serializeJson(doc, requestBody);

  http.begin(client, String("") + SERVER_ADDRESS + "/" + sessionId); //HTTP
  http.addHeader("Content-Type", "application/json");

  while (http.PATCH(requestBody) != 200);
  Serial.println("Data sent " + String(currentReading));
}

void setup() {
  Serial.begin(115200);
  delay(500);

  //Connect to Wifi. Starts AP if no credentials stored
  WiFiManager wifiManager;
  if (!wifiManager.autoConnect("EV-CHARGE-MON")) {
    Serial.println("Connection failed");
    delay(5000);
    ESP.reset();
  }
  //Store MAC. Will be used as a unique id
  StaticJsonDocument<100> macDoc;
  String macStr = WiFi.macAddress();
  macDoc["macAddress"] = macStr;
  Serial.println("MAC: " + macStr);
  serializeJson(macDoc, macJson);

}

void loop() {
  //Random  active current for 25 seconds, 15 seconds of 0 current
  int currents[40];
  for (int i = 0; i < 25; i++) {
    currents[i] = random(11, 50);
  }
  for (int i = 25; i < 40; i++) {
    currents[i] = 0;
  }

  for (int current : currents) {
    char dat[100];
    sprintf(dat, "Current: %d, idle: %d, active: %d, activeSess: %d", current, idleTime, activeTime, sessionActive);
    Serial.println(dat);
    currentReading = current;
    //Update active and idle timers
    if (currentReading > CURRENT_THRESHOLD) {
      activeTime++;
      idleTime = 0;
    }
    else {
      activeTime = 0;
      idleTime++;
    }

    if (activeTime > ACTIVITY_THRESHOLD) {
      //Start session if current greater than threshold for some time
      if (!sessionActive) {
        //Send POST request to server with MAC and get session ID
        startSession();
      }
      //Send PATCH request to server with session ID
      pushData();

    } else if (idleTime > ACTIVITY_THRESHOLD) {
      //End session if current is less than threshold for some time
      sessionActive = false;
      sessionId = "";
    }
    delay(5000);
  }
}
