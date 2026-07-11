package app.nexa.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [MessageEntity::class, ConversationEntity::class, ContactEntity::class],
    version = 3, // v3: messages gained replyTo (destructive migration; cache re-fetched)
    exportSchema = false,
)
abstract class NexaDatabase : RoomDatabase() {
    abstract fun messageDao(): MessageDao
    abstract fun conversationDao(): ConversationDao
    abstract fun contactDao(): ContactDao
}
