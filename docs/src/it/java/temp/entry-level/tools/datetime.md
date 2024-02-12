---
category: IT
article: false
---

# 日期时间

```java
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class DateTimeUtils {

    private static DateTimeFormatter formatterDate = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static DateTimeFormatter formatterTime = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static DateTimeFormatter formatterDateTime = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 获取当前日期
     */
    public static String getCurrentDate() {
        return formatterDate.format(LocalDate.now());
    }

    /**
     * 获取当前时间
     */
    public static String getCurrentTime() {
        return formatterTime.format(LocalTime.now());
    }

    /**
     * 获取当前日期时间
     */
    public static String getCurrentDateTime() {
        return formatterDateTime.format(LocalDateTime.now());
    }

    /**
     * 格式化日期
     */
    public static String getCurrentDate(Date date) {
        /**
         * Date类中的toInstant()方法会将Date对象转换为java.time.Instant对象。Instant是java.time中表示时间戳的类，它精确到纳秒级别
         * Instant对象通过atZone方法被映射到特定的时区。ZoneId.systemDefault()返回系统默认时区的ZoneId对象
         * ZonedDateTime对象通过toLocalDate()方法转换为LocalDate对象。LocalDate表示日期部分，没有时区信息
         */
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//        return localDate.format(formatterDate);
        return localDate.toString(); // 默认格式是 yyyy-MM-dd
    }

    /**
     * 获取当前日期是星期几
     */
    public static int getDayOfWeek() {
        // 获取当前日期
        LocalDate currentDate = LocalDate.now();
        // 获取星期几的枚举值（从 MONDAY 开始）
        DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
        // 获取星期几的数字（星期天为7，星期一为1，以此类推）
        return dayOfWeek.getValue();
    }

    /**
     * 获取指定日期对应是星期几
     */
    public static int getDayOfWeek(Date date) {
        // 将 Date 对象转换为 LocalDate 对象
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        // 获取星期几的枚举值（从 MONDAY 开始）
        DayOfWeek dayOfWeek = localDate.getDayOfWeek();
        // 获取星期几的数字（星期天为7，星期一为1，以此类推）
        return dayOfWeek.getValue();
    }

    /**
     * 获取在当前月份中今天是哪一天
     */
    public static int getDayOfMonth() {
        // 获取当前日期
        LocalDate currentDate = LocalDate.now();
        // 获取在当前月份中今天是哪一天
        int dayOfMonth = currentDate.getDayOfMonth();
        return dayOfMonth;
    }

    /**
     * 获取指定日期中对应的是几号
     */
    public static int getDayOfMonth(Date date) {
        // 将 Date 对象转换为 LocalDate 对象
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        // 获取日期中对应的是几号
        int dayOfMonth = localDate.getDayOfMonth();
        return dayOfMonth;
    }

    /**
     * 获取当前月份的总天数
     */
    public static int getDaysInCurrentMonth() {
        // 获取当前年月
        YearMonth yearMonth = YearMonth.now();
        // 获取当前月份的总天数
        int daysInMonth = yearMonth.lengthOfMonth();
        return daysInMonth;
    }

    /**
     * 获取在当前年份今天是第几天
     */
    public static int getDayOfYear() {
        // 获取当前日期
        LocalDate currentDate = LocalDate.now();
        // 获取在当前年份今天是第几天
        int dayOfYear = currentDate.getDayOfYear();
        return dayOfYear;
    }

    /**
     * 在给定的日期上加上指定分钟数
     */
    public static Date addMinute(Date date, long count) {
        // 将传入的 Date 转换为 LocalDateTime
        LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        // 在 LocalDateTime 上加上指定分钟数
        LocalDateTime newDateTime = localDateTime.plus(count, ChronoUnit.MINUTES);
        // 将新的 LocalDateTime 转换为 Date
        return Date.from(newDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 在给定的日期上加上指定小时数
     */
    public static Date addHour(Date date, long count) {
        // 将传入的 Date 转换为 LocalDateTime
        LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        // 在 LocalDateTime 上加上指定小时数
        LocalDateTime newDateTime = localDateTime.plus(count, ChronoUnit.HOURS);
        // 将新的 LocalDateTime 转换为 Date
        return Date.from(newDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 在给定的日期上加上指定天数
     */
    public static Date addDay(Date date, long count) {
        // 将传入的 Date 转换为 LocalDateTime
        LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        // 在 LocalDateTime 上加上指定天数
        LocalDateTime newDateTime = localDateTime.plus(count, ChronoUnit.DAYS);
        // 将新的 LocalDateTime 转换为 Date
        return Date.from(newDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 在给定的日期上加上指定周数
     */
    public static Date addWeek(Date date, long count) {
        // 将传入的 Date 转换为 LocalDateTime
        LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        // 在 LocalDateTime 上加上指定天数
        LocalDateTime newDateTime = localDateTime.plus(count, ChronoUnit.WEEKS);
        // 将新的 LocalDateTime 转换为 Date
        return Date.from(newDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 在给定的日期上加上指定月数
     */
    public static Date addMonth(Date date, long count) {
        // 将传入的 Date 转换为 LocalDateTime
        LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        // 在 LocalDateTime 上加上指定天数
        LocalDateTime newDateTime = localDateTime.plus(count, ChronoUnit.MONTHS);
        // 将新的 LocalDateTime 转换为 Date
        return Date.from(newDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 在给定的日期上加上指定年数
     */
    public static Date addYear(Date date, long count) {
        // 将传入的 Date 转换为 LocalDateTime
        LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        // 在 LocalDateTime 上加上指定天数
        LocalDateTime newDateTime = localDateTime.plus(count, ChronoUnit.YEARS);
        // 将新的 LocalDateTime 转换为 Date
        return Date.from(newDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 计算两个日期之间的时间差，以天、小时和分钟的形式返回
     *
     * @param endDate 结束日期
     * @param nowDate 当前日期
     */
    public static String getDateDifference(Date endDate, Date nowDate) {
        long millisecondsDifference = endDate.getTime() - nowDate.getTime();

        long days = TimeUnit.MILLISECONDS.toDays(millisecondsDifference);
        long hours = TimeUnit.MILLISECONDS.toHours(millisecondsDifference % TimeUnit.DAYS.toMillis(1));
        long minutes = TimeUnit.MILLISECONDS.toMinutes(millisecondsDifference % TimeUnit.HOURS.toMillis(1));

        return days + "天" + hours + "小时" + minutes + "分钟";
    }

    /**
     * 根据给定的起始时间，计算距离当前时间的时间差，然后返回一个人类可读的时间描述字符串。描述的时间单位包括秒、分钟、小时、天、星期、月和年
     */
    public static String getTimeFormat(Date startTime) {
        try {
            long startTimeMills = startTime.getTime();
            long endTimeMills = new Date().getTime();
            long diff = (endTimeMills - startTimeMills) / 1000;  // 秒
            long dayDiff = (long) Math.floor(diff / 86400);  // 天
            if (dayDiff < 0) {
                return "时间越界";
            }
            if (dayDiff == 0) {
                if (diff < 60) {
                    return (diff == 0) ? "1秒前" : diff + "秒前";
                } else if (diff < 3600) {
                    return (diff < 120) ? "1分钟前" : Math.round(Math.floor(diff / 60)) + "分钟前";
                } else if (diff < 86400) {
                    return (diff < 7200) ? "1小时前" : Math.round(Math.floor(diff / 3600)) + "小时前";
                }
            } else if (dayDiff == 1) {
                return "1天前";
            } else if (dayDiff < 7) {
                return dayDiff + "天前";
            } else if (dayDiff < 30) {
                return Math.round(Math.ceil(dayDiff / 7)) + "星期前";
            } else if (dayDiff < 180) {
                return Math.round(Math.ceil(dayDiff / 30)) + "月前";
            } else if (dayDiff < 365) {
                return "半年前";
            } else {
                return Math.round(Math.ceil(dayDiff / 30 / 12)) + "年前";
            }
            return "";
        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    }

}
```