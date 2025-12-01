package src;

public class Alarm {
    private int hour;
    private int minute;
    private boolean active;
    
    public Alarm(int hour, int minute) {
        this.hour = hour;
        this.minute = minute;
        this.active = true;
    }
    
    public int getHour() { return hour; }
    public int getMinute() { return minute; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public String getFormattedTime() {
        String period = (hour >= 12) ? "PM" : "AM";
        int displayHour = (hour == 0 || hour == 12) ? 12 : hour % 12;
        return String.format("%02d:%02d %s", displayHour, minute, period);
    }
    
    @Override
    public String toString() {
        return getFormattedTime() + (active ? " 🔔" : " 🔕");
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Alarm alarm = (Alarm) obj;
        return hour == alarm.hour && minute == alarm.minute;
    }
}