---
date: 2023-05-13
category: IT
tag:
  - Android
---

# 解决部分安卓机型 SharedPreferences 获取不到值的问题

<!-- more -->

## 分析问题

实战项目中发现有部分用户的安卓手机获取不到 SharedPreferences 存储的值，已知某个用户在使用 APP 时出现异常的安卓机型是 Galaxy S9

我们得先搞懂什么是 SharedPreferences：

当应用程序需要保存少量数据时，Android 提供了 SharedPreferences 的 API 来方便地存储这些数据。SharedPreferences 是一个轻量级的存储机制，它用于存储一些简单的键值对，这些键值对可以很容易地从应用程序中获取和修改

SharedPreferences 存储的数据在应用程序关闭后也会保持不变，因此可以在应用程序下次启动时使用。SharedPreferences 的实现是通过 XML 文件，这个 XML 文件存储在应用程序的 `/data/data/<package-name>/shared_prefs/` 目录下

使用 SharedPreferences 需要进行以下几个步骤：

1. 获取 SharedPreferences 对象：通过 `Context` 的 `getSharedPreferences()` 方法获取 SharedPreferences 对象。`getSharedPreferences()` 方法有两个参数：第一个参数是文件名，可以是任意字符串，建议使用应用程序的包名作为文件名；第二个参数是操作模式，包括 `MODE_PRIVATE`、`MODE_WORLD_READABLE`、`MODE_WORLD_WRITEABLE` 等

2. 存储数据：通过 `SharedPreferences.Editor` 对象存储数据。获取 `Editor` 对象的方式是通过 SharedPreferences 对象的 `edit()` 方法。存储数据的方法包括 `putBoolean()`、`putFloat()`、`putInt()`、`putLong()`、`putString()` 等。调用 `Editor对` 象的 `apply()` 或 `commit()` 方法将数据写入 `SharedPreferences` 文件中

3. 读取数据：通过 SharedPreferences 对象读取数据。读取数据的方法包括 `getBoolean()`、`getFloat()`、`getInt()`、`getLong()`、`getString()` 等

4. 删除数据：通过 `SharedPreferences.Editor` 对象删除数据。删除数据的方法包括 `remove()` 和 `clear()`

以下是 SharedPreferences 的示例代码：

```text
// 获取SharedPreferences对象
SharedPreferences sp = getSharedPreferences("my_prefs", Context.MODE_PRIVATE);

// 存储数据
SharedPreferences.Editor editor = sp.edit();
editor.putString("key1", "value1");
editor.putInt("key2", 123);
editor.apply();

// 读取数据
String value1 = sp.getString("key1", "");
int value2 = sp.getInt("key2", 0);

// 删除数据
editor.remove("key1");
editor.clear();
editor.apply();
```

当调用 `context.getSharedPreferences()` 方法时，Android 系统会为您的应用程序创建一个名为 SharedPreferences 的 XML 文件，用于存储应用程序的配置数据

即使你的应用程序被禁用了存储空间权限，SharedPreferences 文件仍然会被创建和存储在应用程序的私有数据目录中，私有数据目录是应用程序专用的目录，只有应用程序本身可以访问。其他应用程序和系统无法访问该应用程序的私有数据目录中的数据，包括 SharedPreferences 文件中的数据

需要注意的是，虽然 SharedPreferences 文件存储在应用程序的私有数据目录中，但是在某些情况下，例如用户卸载应用程序或清除应用程序的数据，SharedPreferences 文件也会被删除

---

如果手上能拿到有问题的机型就可以复现问题并通过程序调试排查出原因，例如：

- 确保你的应用程序在上具有正确的权限，并尝试清除应用程序的缓存和数据，以确保应用程序可以正确地访问 SharedPreferences 中的数据

- 可以检查问题机型的操作系统版本，以确定是否存在与 SharedPreferences 存储数据相关的已知问题或错误修复。如果有可用的系统更新，请尝试更新操作系统

- 尝试使用其他存储选项，例如将数据存储在文件中，或使用 SQLite 数据库来存储数据

但因为我手上已有的安卓手机都无法复现获取不到 SharedPreferences 存储值的问题，分析判断可能是由于某些原因，这些异常机型上的 SharedPreferences 不兼容我的应用。最终我采取了使用 SQLite 来存储数据的方式并提供一个测试版 APK 安装包让一个存在使用异常的机型用户下载并验证是否已修复问题

---

SQLite 是一款轻量级的关系型数据库，它的特点是体积小、速度快、可移植性强，非常适合在移动设备等嵌入式设备中使用。在 Android 中，SQLite 是 Android 内置的数据库管理系统，被广泛地用于应用程序的数据存储。SQLite 的数据存储在应用程序的私有文件目录下，存储的文件名为应用程序包名加上 ".db" 后缀的文件

Android 中的 SQLite 数据库可以通过 `SQLiteOpenHelper` 类进行创建和升级，它提供了 `onCreate()` 和 `onUpgrade()` 等回调函数，使得开发者可以在数据库创建和升级时进行相应的操作。当应用程序需要访问数据库时，需要获取数据库的读写权限，并通过 `SQLiteOpenHelper` 类的 `getWritableDatabase()` 或 `getReadableDatabase()` 方法获取一个数据库实例，然后通过 SQL 语句执行相应的操作，如插入数据、更新数据、查询数据等

当你在应用程序中创建一个 SQLite 数据库时，它将被存储在应用程序的私有目录下的 databases 子目录中。具体来说，它将存储在 `/data/data/your.package.name/databases/` 目录下，其中 your.package.name 是你应用程序的包名

## 解决问题

原来使用 SharedPreferences 存储数据：

```java
public final class DefaultShared {
    private static SharedPreferences getSpf(Context context) {
        return context.getSharedPreferences(getSharedPreferenceDataName(context), Context.MODE_PRIVATE);
    }

    public static void putString(Context context, String key, String value) {
        if (null != context && !TextUtils.isEmpty(key)) {
            getSpf(context).edit().putString(key, value).commit();
        }
    }

    public static String getString(Context context, String key, String defValue) {
        if (null != context && !TextUtils.isEmpty(key)) {
            return getSpf(context).getString(key, defValue);
        }
        return defValue;
    }
}
```

修改成使用 `SQLite` 存储数据：

以下协定定义了表示 RSS Feed 的单个表的表名称和列名称：

```java
import android.provider.BaseColumns;

public class FeedReaderContract {
    // To prevent someone from accidentally instantiating the contract class,
    // make the constructor private.
    private FeedReaderContract() {
    }

    /* Inner class that defines the table contents */
    public static class FeedEntry implements BaseColumns {
        public static final String TABLE_NAME = "test_table";
        public static final String COLUMN_NAME_VALUE1 = "value1";
        public static final String COLUMN_NAME_VALUE2 = "value2";

    }
}
```

使用 SQL 帮助程序创建数据库：

```java
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class FeedReaderDbHelper extends SQLiteOpenHelper {

    private static final String SQL_CREATE_ENTRIES =
            "CREATE TABLE " + FeedReaderContract.FeedEntry.TABLE_NAME + " (" +
                    FeedReaderContract.FeedEntry._ID + " INTEGER PRIMARY KEY," +
                    FeedReaderContract.FeedEntry.COLUMN_NAME_VALUE1+ " TEXT," +
                    FeedReaderContract.FeedEntry.COLUMN_NAME_VALUE2 + " TEXT)";

    private static final String SQL_DELETE_ENTRIES = "DROP TABLE IF EXISTS " + FeedReaderContract.FeedEntry.TABLE_NAME;


    // If you change the database schema, you must increment the database version.
    public static final int DATABASE_VERSION = 1;
    public static final String DATABASE_NAME = "FeedReader.db";

    public FeedReaderDbHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    public void onCreate(SQLiteDatabase db) {
        db.execSQL(SQL_CREATE_ENTRIES);
    }

    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // This database is only a cache for online data, so its upgrade policy is
        // to simply to discard the data and start over
        db.execSQL(SQL_DELETE_ENTRIES);
        onCreate(db);
    }

    public void onDowngrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        onUpgrade(db, oldVersion, newVersion);
    }
}
```

```java
public final class DefaultShared {

    public static void putString(Context context, String key, String value) {
        FeedReaderDbHelper dbHelper = new FeedReaderDbHelper(context);
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        Cursor cursorTable = db.rawQuery("SELECT * FROM " + FeedReaderContract.FeedEntry.TABLE_NAME, null);
        if (cursorTable.getCount() == 0) {
            ContentValues values = new ContentValues();
            if (Constants.VALUE1.equals(key)) {
                values.put(FeedReaderContract.FeedEntry.COLUMN_NAME_VALUE1, value);
            } else if (Constants.VALUE2.equals(key)) {
                values.put(FeedReaderContract.FeedEntry.COLUMN_NAME_VALUE2, value);
            }
            db.insert(FeedReaderContract.FeedEntry.TABLE_NAME, null, values);
        } else {
            ContentValues values = new ContentValues();
            if (Constants.VALUE1.equals(key)) {
                values.put(FeedReaderContract.FeedEntry.COLUMN_NAME_VALUE1, value);
            } else if (Constants.VALUE2.equals(key)) {
                values.put(FeedReaderContract.FeedEntry.COLUMN_NAME_VALUE2, value);
            }
            String selection = FeedReaderContract.FeedEntry._ID + "= ?";
            String id = "";
            if (cursorTable.moveToFirst()) {
                id = cursorTable.getString(cursorTable.getColumnIndex(FeedReaderContract.FeedEntry._ID));
            }
            if (!TextUtils.isEmpty(id)) {
                String[] selectionArgs = {id};
                db.update(FeedReaderContract.FeedEntry.TABLE_NAME, values, selection, selectionArgs);
            }
        }
    }

    public static String getString(Context context, String key, String defValue) {
        FeedReaderDbHelper dbHelper = new FeedReaderDbHelper(context);
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursorTable = db.rawQuery("SELECT * FROM sqlite_master WHERE type='table' AND name='test_table'", null);
        boolean tableExists = (cursorTable != null) && (cursorTable.getCount() > 0);
        if (!tableExists) {
            dbHelper.onCreate(db);
        }
        cursorTable.close();
        Cursor cursor = db.rawQuery("SELECT * FROM " + FeedReaderContract.FeedEntry.TABLE_NAME, null);
        if (cursor.getCount() == 0) {
            return defValue;
        } else {
            String value = "";
            if (Constants.VALUE1.equals(key)) {
                while (cursor.moveToNext()) {
                    value = cursor.getString(cursor.getColumnIndexOrThrow(FeedReaderContract.FeedEntry.COLUMN_NAME_VALUE1));
                }
            } else if (Constants.VALUE2.equals(key)) {
                while (cursor.moveToNext()) {
                    value = cursor.getString(cursor.getColumnIndexOrThrow(FeedReaderContract.FeedEntry.COLUMN_NAME_VALUE2s));
                }
            }
            cursor.close();
            return value;
        }
    }
}
```

## 参考资料

[开发者指南 - 使用 SQLite 保存数据](https://developer.android.google.cn/training/data-storage/sqlite?hl=zh-cn)