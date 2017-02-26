declare upper;
input ST_Coeff = 3; # Between 1 - 100
input ST_Period = 7; #Between 1 - 100

def iATR = ATR(ST_Period);
def tmpUp = hl2 - (ST_Coeff * iATR);
def tmpDn = hl2 + (ST_Coeff * iATR);
def finalUp = If(close[1] > finalUp[1], Max(tmpUp, finalUp[1]), tmpUp);
def finalDn = If(close[1] < finalDn[1], Min(tmpDn, finalDn[1]), tmpDn);
def trendDir = If( close > finalDn[1], 1, If( close < finalUp[1], -1, If(!IsNaN(trendDir[1]), trendDir[1], 1) ) );
def trendLine = If(trendDir == 1, finalUp, finalDn);

plot SuperTrend = trendLine;

SuperTrend.DefineColor( "up", Color.GREEN );
SuperTrend.DefineColor( "dn", Color.RED );
SuperTrend.AssignValueColor(SuperTrend.Color("up"));
SuperTrend.AssignValueColor( if close[1] > SuperTrend[1] then SuperTrend.Color( "up" ) else SuperTrend.Color( "dn" ) );
SuperTrend.SetLineWeight( 2 );

def entryPrice = open[-1];
def exitPrice = open[-1];
def tSize = 100;

def sma200 = MovingAverage(AverageType.SIMPLE, close, 200);
def bullMarket = open[-1] > sma200;
def bearMarket = open[-1] < sma200;

# Bull Market BUY
AddOrder(OrderType.BUY_TO_OPEN, 
    close[-1] > SuperTrend[-1] and close[0] < SuperTrend[0]
    , price = entryPrice, tradeSize = tSize, tickcolor = GetColor(0), arrowcolor = GetColor(1));
# Bull Market SELL
AddOrder(OrderType.SELL_TO_CLOSE, close[-1] < SuperTrend[-1]
    and close[0] > SuperTrend[0], price = exitPrice, tradeSize = tSize, tickcolor = GetColor(1), arrowcolor = GetColor(0));