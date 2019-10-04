var mongoose = require("mongoose");
var MarketSummarySchema = new mongoose.Schema({
    ID: Number,
    Market: String,
    Thought: String,
    BuyZone: Number,
    SellZone: Number,
    Trend: Number,
    watchlist: Number,
    Zonewatchlist: Number,
    created:  {type: Date, default: Date.now}
});

module.exports = mongoose.model("MarketInsight", MarketSummarySchema);
