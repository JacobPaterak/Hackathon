#define NUM_BUZZERS 1
const uint8_t buzzerPins[NUM_BUZZERS] = {5};

#define NUM_LEDS 3
const uint8_t ledPins[NUM_LEDS] = {8, 12, 13};

void setup() {
  Serial.begin(115200); // Serial connection to Python
  for (uint8_t i = 0; i < NUM_BUZZERS; i++) pinMode(buzzerPins[i], OUTPUT);
  for (uint8_t i = 0; i < NUM_LEDS; i++) pinMode(ledPins[i], OUTPUT);
}

void playSequence() {
  tone(buzzerPins[0], 784, 125); digitalWrite(ledPins[0], HIGH); delay(125); digitalWrite(ledPins[0], LOW);
  tone(buzzerPins[0], 740, 125); digitalWrite(ledPins[1], HIGH); delay(125); digitalWrite(ledPins[1], LOW);
  tone(buzzerPins[0], 622, 125); digitalWrite(ledPins[2], HIGH); delay(125); digitalWrite(ledPins[2], LOW);
  tone(buzzerPins[0], 440, 125); digitalWrite(ledPins[0], HIGH); delay(125); digitalWrite(ledPins[0], LOW);
  tone(buzzerPins[0], 830, 125); digitalWrite(ledPins[1], HIGH); delay(125); digitalWrite(ledPins[1], LOW);
  tone(buzzerPins[0], 659, 125); digitalWrite(ledPins[2], HIGH); delay(125); digitalWrite(ledPins[2], LOW);
  tone(buzzerPins[0], 830, 150); digitalWrite(ledPins[0], HIGH); delay(150); digitalWrite(ledPins[0], LOW);
  tone(buzzerPins[0], 523, 500); digitalWrite(ledPins[0], HIGH); digitalWrite(ledPins[1], HIGH); digitalWrite(ledPins[2], HIGH);
  delay(500); digitalWrite(ledPins[0], LOW); digitalWrite(ledPins[1], LOW); digitalWrite(ledPins[2], LOW);
  noTone(buzzerPins[0]);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "PLAY") {
      playSequence();
      Serial.println("DONE");
    }
  }
}
