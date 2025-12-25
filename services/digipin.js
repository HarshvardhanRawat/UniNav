const Room = require('../models/rooms.js');

// Generate map link from digipin
const generateMapLinkFromDigipin = (digipin) => {
  if (!digipin) return null;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(digipin)}`;
};

// Automatically add mapLink to room data
const addMapLinkToRoomData = (roomData) => {
  if (!roomData || !roomData.digipin) {
    return roomData;
  }
  
  roomData.mapLink = generateMapLinkFromDigipin(roomData.digipin);
  return roomData;
};

// Update mapLink in database for a specific room
const updateMapLinkInDatabase = async (roomId, digipin) => {
  if (!roomId || !digipin) {
    return null;
  }
  
  const mapLink = generateMapLinkFromDigipin(digipin);
  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    { mapLink: mapLink },
    { new: true }
  );
  
  return updatedRoom;
};

// Update mapLink for all rooms that have digipin but no mapLink
const updateAllMissingMapLinks = async () => {
  const roomsWithoutMapLink = await Room.find({
    digipin: { $exists: true, $ne: null, $ne: '' },
    $or: [
      { mapLink: { $exists: false } },
      { mapLink: null },
      { mapLink: '' }
    ]
  });
  
  let updatedCount = 0;
  for (const room of roomsWithoutMapLink) {
    if (room.digipin) {
      const mapLink = generateMapLinkFromDigipin(room.digipin);
      await Room.findByIdAndUpdate(room._id, { mapLink: mapLink });
      updatedCount++;
    }
  }
  
  return updatedCount;
};

module.exports = {
  generateMapLinkFromDigipin,
  addMapLinkToRoomData,
  updateMapLinkInDatabase,
  updateAllMissingMapLinks
};
