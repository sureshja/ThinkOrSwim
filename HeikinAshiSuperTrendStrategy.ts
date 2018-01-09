declare upper;
input ST_Coeff = 3; # Between 1 - 100
input ST_Period = 7; #Between 1 - 100

###############
# SuperTrend1 #
###############
input aggrPd1 = AggregationPeriod.FOUR_HOURS;

# Heikin Ashi Stuff
# Working off of HA open, high, low, close 
def hacl1 = ( open(period = aggrPd1) + high(period = aggrPd1) + low(period = aggrPd1) + close(period = aggrPd1) ) / 4;
def haop1 = CompoundValue(1, (haop1[1] + hacl1[1]) / 2, (open(period = aggrPd1)[1] + close(period = aggrPd1)[1]) / 2);
def hahi1 = Max( open(period = aggrPd1), Max( hacl1, haop1 ) );
def halo1 = Min( low(period = aggrPd1), Min( hacl1, haop1 ) );
def hahl2_1 = (hahi1 + halo1) / 2;

#def iATR1 = ATR(ST_Period);
def iATR1 = MovingAverage(AverageType.WILDERS, TrueRange(hahi1, hacl1, halo1), ST_Period);

def tmpUp1 = hahl2_1 - (ST_Coeff * iATR1); #hahl2 is better than hl2
def tmpDn1 = hahl2_1 + (ST_Coeff * iATR1); #hahl2 is better than hl2
def finalUp1 = If(close(period = aggrPd1)[1] > finalUp1[1], Max(tmpUp1, finalUp1[1]), tmpUp1);
def finalDn1 = If(close(period = aggrPd1)[1] < finalDn1[1], Min(tmpDn1, finalDn1[1]), tmpDn1);
def trendDir1 = If( close(period = aggrPd1) > finalDn1[1], 1, If( close(period = aggrPd1) < finalUp1[1], -1, If(!IsNaN(trendDir1[1]), trendDir1[1], 1) ) );
def trendLine1 = If(trendDir1 == 1, finalUp1, finalDn1);
plot SuperTrend1 = trendLine1;

SuperTrend1.DefineColor( "up", Color.GREEN );
SuperTrend1.DefineColor( "dn", Color.RED );
SuperTrend1.AssignValueColor(SuperTrend1.Color("up"));
SuperTrend1.AssignValueColor( if close(period = aggrPd1)[1] > SuperTrend1[1] then SuperTrend1.Color( "up" ) else SuperTrend1.Color( "dn" ) );
SuperTrend1.SetLineWeight( 2 );

###############
# SuperTrend2 #
###############
input aggrPd2 = AggregationPeriod.DAY;

# Heikin Ashi Stuff
# Working off of HA open, high, low, close 
def hacl2 = ( open(period = aggrPd2) + high(period = aggrPd2) + low(period = aggrPd2) + close(period = aggrPd2) ) / 4;
def haop2 = CompoundValue(1, (haop2[1] + hacl2[1]) / 2, (open(period = aggrPd2)[1] + close(period = aggrPd2)[1]) / 2);
def hahi2 = Max( open(period = aggrPd2), Max( hacl2, haop2 ) );
def halo2 = Min( low(period = aggrPd2), Min( hacl2, haop2 ) );
def hahl2_2 = (hahi2 + halo2) / 2;

#def iATR1 = ATR(ST_Period);
def iATR2 = MovingAverage(AverageType.WILDERS, TrueRange(hahi2, hacl2, halo2), ST_Period);

def tmpUp2 = hahl2_2 - (ST_Coeff * iATR2); #hahl2 is better than hl2
def tmpDn2 = hahl2_2 + (ST_Coeff * iATR2); #hahl2 is better than hl2
def finalUp2 = If(close(period = aggrPd2)[1] > finalUp2[1], Max(tmpUp2, finalUp2[1]), tmpUp2);
def finalDn2 = If(close(period = aggrPd2)[1] < finalDn2[1], Min(tmpDn2, finalDn2[1]), tmpDn2);
def trendDir2 = If( close(period = aggrPd2) > finalDn2[1], 1, If( close(period = aggrPd2) < finalUp2[1], -1, If(!IsNaN(trendDir2[1]), trendDir2[1], 1) ) );
def trendLine2 = If(trendDir2 == 1, finalUp2, finalDn2);
plot SuperTrend2 = trendLine2;

SuperTrend2.DefineColor( "up", Color.GREEN );
SuperTrend2.DefineColor( "dn", Color.RED );
SuperTrend2.AssignValueColor(SuperTrend2.Color("up"));
SuperTrend2.AssignValueColor( if close(period = aggrPd2)[1] > SuperTrend2[1] then SuperTrend2.Color( "up" ) else SuperTrend2.Color( "dn" ) );
SuperTrend2.SetLineWeight( 2 );

###############
# SuperTrend3 #
###############


# Strategy Calculations
def entryPrice = open(period = aggrPd1)[-1];
def exitPrice = open(period = aggrPd1)[-1];
def tSize = 5000 / entryPrice;

def sma200 = MovingAverage(AverageType.SIMPLE, close(period = aggrPd1), 200);
def bullMarket = open(period = aggrPd1)[-1] > sma200;
def bearMarket = open(period = aggrPd1)[-1] < sma200;

# Bull Market BUY
AddOrder(OrderType.BUY_TO_OPEN, close(period = aggrPd1)[-1] > SuperTrend1[-1] and close(period = aggrPd1)[0] < SuperTrend1[0], price = entryPrice, tradeSize = tSize, tickcolor = GetColor(0), arrowcolor = GetColor(1));
# Bull Market SELL
AddOrder(OrderType.SELL_TO_CLOSE, close(period = aggrPd1)[-1] < SuperTrend1[-1]
    and close(period = aggrPd1)[0] > SuperTrend1[0], price = exitPrice, tradeSize = tSize, tickcolor = GetColor(1), arrowcolor = GetColor(0));
