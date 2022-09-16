%builtins output pedersen range_check
from starkware.cairo.common.serialize import serialize_word

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math_cmp import is_le
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.registers import get_fp_and_pc
from starkware.cairo.common.math import assert_nn_le
from starkware.cairo.common.math import signed_div_rem

const PRICE_DOWN_MAX = 0
const PRICE_DOWN_EXTREME = 1
const PRICE_DOWN_LARGE = 2
const PRICE_DOWN_MID = 3
const PRICE_DOWN_SMALL = 4
const PRICE_DOWN_MIN = 5
const PRICE_UP_MIN = 6
const PRICE_UP_SMALL = 7
const PRICE_UP_MID = 8
const PRICE_UP_LARGE = 9
const PRICE_UP_EXTREME = 10
const PRICE_UP_MAX = 11

const BUY_STRATEGY = 0
const SELL_STRATEGY = 1
const NULL_STRATEGY = 2

const WETH_DECIMALS = 18
const USDC_DECIMALS = 6

# @storage_var
# func owner() -> (owner_address: felt):
# end

# @storage_var
# func l1_contract() -> (l1_contract_address: felt):
# end

# @event
# func strategy_sent_to_l2(strategy: felt, amount: felt):
# end

# @constructor
# func constructor{
#     syscall_ptr : felt*,
#     pedersen_ptr : HashBuiltin*,
#     range_check_ptr,
# }(_owner_address: felt, _l1_contract_address: felt):
#     owner.write(value=_owner_address)
#     l1_contract.write(value=_l1_contract_address)
#     return ()
# end

func main{output_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}():
    alloc_locals
    serialize_word(1)
    local x_data_tuple: (felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt) = (0,-144963658,82395706,-2212423489,-1388859485,-4058085731,-4703027150,-5446305470,-6164703334,-5581588318,-12492518241,-12813361148,-12911392063,-13217885348,-12390007403,-13667569599,-15699779019,-17221632051,-19157844994,-18421707207,-17970091692,-17489747543,-17137135089,-17805047430,-18448572978,-17112192454,-16477953814,-18013181501,-16645562265,-15864219974,-16330670665,-15871426371,-15216618463,-15093081736,-15507028304,-15407618852)
    local a_data_tuple: (felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt) = (15407574,-24997910,8868415,-10745569,5461104,-10425139,-19563936,16885906,-10681748,3032095,12424625,-13607959,-10677269,8854088,17691584,14799342,-10903540,-15412094,-20391886,2208216,22181728,-9571063,32460722,12251467,4891035,-1897716,11756359,11500257,12158310,-5715232,-1685147,5046407,-10013901,6193937,-3227603,-23066748,-15864941,-14213927,1669989,-3250160,35091324,13238329,8748419,-16855322,804129,-7879884,8161906,8139168,12581643,-5956773,17591042,-850386,-1288435,-19203380,-8812448,2223546,-17226774,11976741,6769568,-1324488,23599826,14728595,4863817,-8855361,-19156020,-21417662,-9647481,-19510364,20918568,6930437,13667859,-16755450,-13196066,-19812134,-12505893,2391731,17806906,32843118,-10480190,9892808,10862637,-9494510,16414514,-9904177,-7891494,19588474,1076213,18272316,17978092,-21491558,-11082244,-11340287,-15879989,-18904994,13039137,6446448,16653319,-5245747,-26432914,8637935,-7903555,14644709,-9030188,-22337272,11715376,-4487271,14283614,23617772,-7591985,32773390,5184376,-13638230,-11379515,3984394,-18066512,-5081209,10806993,23433226,7833127,22742430,18657742,8767226,11103696,-475210,22685576,20073262,-1846322,5632756,-8740695,17039930,-6005826,15486984,15723489,-11559708,-6522628,2141014,-12744927,-34267292,13104974,15105419,-16064164,-177553,-946333,-696004,-14717726,9808469,7885980,-12208896,-9896592,17820362,33849448,6451832,-3327252,6084212,25964210,30143044,8465396,-12147246,-5510858,2288353,-5494296,24826176,2694708,-12817496,4415013,2656109,5095406,25492910,-11922819,-16198085,-5389971,13277046,-11754296,-16062059,9499011,13583322,-4964429,-8620965,-8731231,6617658,9848889,-5890153,-8179091,6941015,13931286,25185562,-10955261,-1309926,-609679,22219492,-25428056,-9081259,-15737511,401405,846116,14318015,8566377,4188083,-231104,21732952,11506090,6431369,4009816,-9797299,-19536824,12604742,10493457,9440728,3511556,-8033196,-13170081,25110886,13214330,-5337227,-14828275,-6543102,-1754989,11359013,-18655852,-14558412,-1157953,-12687276,-10140060,8800182,-18380514,-18888904,35145152,25933144,-22150616,-4055686,-6273292,8908648,-4387619,11633018,-13205418,11209046,2142080,-6091840,-10582935,13165022,-5180047,-6792923,5311939,3429643,12181842,2272232,16062644,-19579158,3421432,-10000419,-8246035,1163075,-4085145,19505234,-1840450,21736712,-4827853,8551104,-30948720,3254342,25386838,-29644758,18270204,20938736,-8984073,2495051,-8640728,-18247936,-6995374,19987864,23231860,-6233244,6657309,6916392,13576449,4642849,4618901,-13981472,-2578744,5442007,-18348060,-23265846,19723164,7951431,-3237253,-27175238,15685010,3098546,12440984,17455160,-7713402,26081928,770830,1138386,16584189,4631767,-697277,392202,5957472,-20449420,-2486661,-4621776,19510744,4550963,4752763,26655694,416787,19323986,-13698091,-16465874,18342514,19478924,-2563763,-29429042,22293414,-6266820,-19110376,-9783662,-4885403,296854,6058307,17291882,3474467,-372866,-6850528,20700560,24366378,13343623,-20263470,7677091,-21633102,-25342562,24537360,-2100204,-18360262,-23163384,2809393,-3133237,19598530,3163614,3287966,-23998002,18360994,27912810,-5704787,13221435,-3962568,9445686,-13340543,15954487,-8092731,-12105177,-5464717,26110872,7954626,9762200,5286799,13565837,-7460704,-22033078,16080835,-18841728,-17641544,-152540,23779990,7431378,-19060496,-1899811,-24965570,11691680,1650301,-7190597,-7154964,19183428,16264433,1592011,14264591,-19420136,-11581389,19742850,-5615517,6196161,-6191858,-13037452,17546936,1891138,-17708702,-5449193,-7417069,24674966,5581476,-13473710,-19183504,1220175,49247,13169694,11607580,1102379,-8350455,-14977522,14631465,17145686,-13250615,23428506,-8462533,-11044151,16133063,-5061247,6476029,7605079,-13778031,2755271,-29056040,26813548,28643018,11909799,-21722006,21526716,1465609,3039510,734703,2165711,16173258,-11130246,-12478806,-4564949,-13000481,-21239166,11116771,4549808,7214226,12772912,-5769344,-24937000,25157910,7458713,11294738,-3122174,-23383820,23089152,-1614283,-10653078,-21196658,-14262491,3601638,2083663,12825556,-5669848,8436237,28020114,-9788110,-3405196,-21463214,10616761,9008001,-25870764,1608856,1942737,-17648690,23667590,-25241574,15644510,4219408,-7161941,249230,15468782,4992797,10202947,5290464,11364719,16102034,7327594,31187248,-12893565,-17053808,10836019,-8806089,13954028,-11605730,6274052,7338787,-3767864,11118570,11119636,-10455298,14425629,9359818,11194985,18237386,-3273206,-4620151,-20040924,-14468826,16000888,17952748,-29055,8741123,21062326,-934128,-4558962,-19884636,-1594896,16783888,-16176787,3745921,11510220,13455111,-13623445,20617272,15309173,8716471,-22873742,-3124552,-14994892,-14785655,-5089016,18911374,15569238,13510099,-6969067,12143302,27102352,-31374672,65324,32222926,20152678,-5705677,-10721330,-7262349,-7483329,-2021878,-11464380,2065246,-12249000,13810550,13459845,-20680616,19023504,-5641605,-3692550,-5030463,10402612,-27413752,-10315181,10903743,26510268,18119556,-10809908,-4519263,14802875,12265811,-11703238,-13452420,-12786911,26627422,-25947940,-9099423,21856684,2781157,-14612608,-8009373,-22291454,-12449306,15784600,11483327,17758924,7055512,10019728,-19460176,-13539048,24425114,14075924,-6414252,-22816134,-1516049,8445489,-9996345,-5841719,-6763009,-14329119,-7963817,12866619,17011518,-34715980,-8569139,14648677,12569577,-3941651,183239,29245502,3189415,-12266348,-23897832,36799400,-14913653,-2023833,10280246,-910908,-13931943,3582266,-14462629,-23679652,7491734,7259205,11263802,22853158,-13087691,28204974,11268453,-1419042,-17919972,-1071054,-10320614,2757006,-21165074,1155489,26513228,-20800094,-2931144,-24287662,-7673719,-14581081,9479012,-12986064,7763882,4428100,8451229,10646019,255564,10723299,10960996,6701190,-21306302,-24884884,18759660,21655712,-4833849,7536175,-14568740,-10729580,18735700,-15526871,2386598,13133027,6793932,4574680,-14558376,168062,14425263,17475440,-10469121,19524772,-23549108,18906364,19096368,-18966048,21752218,-6443628,15509769,13756222,-9801510,-20262742,-6161022,-4061155,-16660185,-7110922,5417069,5780933,-18159708,6581121,26137658,-21250964,-8909880,-3406122,-1048977,22259332,7441260,-12530027,5395099,-12071631,-6803726,22389648,-2716065,-15777224,-3269451,-5824180,14058511,-11076841,4458653,-5987871,4380442,-14686635,-97812,25801512,18781918,8005559,-29379624,-19799060,480730,19561056,-3772823,3375558,-13711007,4196864,5374579,-9766069,-238521,28298730,-7883107,19368594,17880650,28781450,19102908,-21822274,-11208908,-16075823,-16535664,-10199378,-19152202,13584228,6475415,-3549991,35020012,5568559,-2512802,5545178,890323,-8882766,-9084737,15174995,-3011253,13614485,-21953602,-4739814,-11719908,673240,-10895131,12323210,-24286134,31223288,3128167,1109119,-15019612,17404496,11271635,-21000392,-18980138,8308032,-7082367,8330700,-800563,2629064,-14854532,13561592,10042156,992739,-3849753,11657409,-21371136,20895604,19776172,3965512,-2991027,-16609654,-19001784,15850602,-24496534,4614779,19255548,2007098,14767188,3854817,-10387687,-5852164,8456437,-17993746,-24573294,-18947194,-12471157,-2790901,8968532,-2038111,23423982,19130922,-21507720,-7736882,4386715,14606154,8401133,4680502,796882,18474094,11092629,308873,19168552,-27955312,2103863,33633228,5533051,-10226469,-5972960,-29430228,18798784,-12338605,8468724,-6735988,14274718,-1291086,18090402,-11504667,-3081694,1436907,-17100832,-11167051,-1670253,-18988426,-11411396,6906469,12406055,14557964,-8520442,888860,12578055,-10741393,-15673342,23492808,-10822846,19592592,8515774,7443996,5388993,2248318,12019966,-9066775,18509280,-27375770,-13034281,421760,28654382,-2694750,-18263418,14361754,-10306463,-15101241,1741607,-4725123,9766192,8238406,14448169,10237294,19142958,-11814288,16549227,-8263200,2482888,5824669,-14889184,18947796,-6996029,19373324,-3698188,21086114,3988802,-17377354,13128994,515742,-27201408,-6222896,-13067828,3597838,10768709,-7598521,-15457042,-399596,9288374,9899294,3444000,9242979,-12791923,28570360,9944894,-8147547,12660904,-88473,-2431283,-11816765,-9762877,7175060,-12174199,-2029239,11489364,15773904,-6214019,8526983,-11590300,-17989772,20499022,16833654,-19728216,-15330294,-2650227,15108173,-8839559,30852584,-7609344,11517826,-10249858,-8230404,-1307153,-6801619,-14895165,19559052,20909368,10425059,22242480,-30287314,-12033429,-11693806,11108149,14773545,4272749,6500756,-25967470,8723062,15703759,4431450,-14523706,-9999326,10616341,20154882,-3903738,25536892,-3635967,-10541309,-15409389,-4419482,-16445291,32498828,43800576,15403239,-6330342,-15764853,558765,-8164239,-25262990,621631,9356108,3460564,-15603401,2352067,-12919566,11864199,-9797888,-2564026,10261179,-9291103,17229464,14383452,-3162149,13154419,-11189900,-17692708,-24344518,1180175,-5413863,-10404191,16291729,6676012,8389926,20443762,-21430806,8355667,3996221,3081788,-20642444,10603409,-8395831,836400,28019210,-5100674,4642720,-22515468,-3096637,4549110,1795911,-914105,26217412,-7844199,-10724624,4672390,-27197962,-3246964,5468761,-1206306,4440726,-4202960,-3288881,8373184,18221726,-14489435,6579008,18309886,-329772,17235426,-2104954,19509872,-8319004,549322,14263833,13851075,13155532,9004319,6340442,-15361367,7959445,10560196,-13194306,19652764,-15325199,-18179272,7185337,16104278,-8750062,-18529726,11998123,-6025119,11746903,23644486,-8959187,18089312,1969402,-11926580,-22069044,-1263628,-15295818,16863056,-12389568,20072066,14587347,-4705062,2713875,11568807,-1919744,12750854,-10112821,40190628,18738606,-20835742,1467798,-22651836,-9653106,38174672,13815667,2006448,-11123069,18498454,14669469,1182449,-12258057,-22303714,9684210,11708763,-6681077,-17131392,18166098,-2894733,-5294481,-8146424,-4219138,-14810628,15195827,19716036,-752407,-10025688,3495271,-12435766,22088810,31849,2355868,-21344104,6682364,28493774,-2090435,-15835722,2468506,-1350826,35417324,-5574392,16907684,-18302802,-9165654,-2521316,-17507204,-29899910,-18715284,19523230,-2100285,-5420143,4744044,-5666452,-6376941,5229945,-11269345,20810820,-199907,-5778455,-10666487,7935749,-12562557,-10902105,-4972117,7156810,13830759,10067584,-2900679,12691854,5657593,7370803,2095628,-3008831,-19242940,19649076,-13075681,14510421,17445526,-8084813,-13829948,-4874215,-7027614,6428789,4216943,-19318428,-4734942,-15684175,25807980,6073473,10107837,-9817261,-14210190,-12707962,-3017031,-8551316,11290729,8504664,12245628,-1570796,26041720,20628196,2782441,-23947400,18707228,3880359)
    local a_bias_tuple: (felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt) = (-103784216,-28330898,-38502896,-5394866,17616384,-158308992,-60403584,8620076,-18105002,-41160208,-105628232,-29855540,-97424528,24370484,-15538295,-88585600,-10466295,-55912356,-28546300,-19073416,-74619784,-42013156,1767632,-105919584,-15411800,-68819888,-80242680,-10912389,33603452,-48899896,-31277726,-90581968)
    local b_data_tuple: (felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt) = (12895130,4574567,1554937,-17996780,13716154,12786441,-1905518,-4499421,11507885,-5795960,30659780,-1925758,-4387674,-13843463,-10748812,104532,5469849,2923312,-16934394,25580766,-3814881,-12687720,16543865,-4844640,-3941703,4982088,-2634181,5574963,-12746173,-32664856,5661219,-4374868,-9130821,-2297658,-15115446,5643428,-20358702,-935800,-15392223,-10010821,3464269,-7596904,-13458467,-1447243,-5713967,957847,-12663646,2418469,163667,-4357913,-11255088,-31148356,-49615808,-5565785,15782964,-6844231,-2154415,-1582139,25077856,-8098897,9068932,-32039526,-8850963,-5917111,-6179316,-1149592,10377979,-196431,-6250242,-10499413,14529428,-5055357,-8494814,243483,-16767727,-8827723,21757202,18668956,8483386,-3473074,-18521696,16516440,4274304,3941353,-21028742,-8004746,-2013400,-14854513,-11985815,-1652959,3672867,8046763,-8654932,6932252,-14169453,21260560,10753287,5564839,17595370,13736981,11959399,-13657728,5403153,6125615,-6685441,5046671,12230087,14561237,-10788912,14692710,2316841,191194,3703871,8032863,-20227982,-6783845,16741292,-7286154,9200358,-7503803,13888213,-8240437,-11394183,-7223259,12261014,-5498925,-12209681,3880560,-8322658,-300702,-2601020,2852394,2561211,6149585,7802361,-14966682,-13323988,-10556670,4727207,6745281,14914648,2933522,9244081,9114105,11592677,6874608,33499616,6977989,10445068,-10393552,-4448569,-9492994,8875018,2145673,5063748,3222183,-14549503,-3462457,-17153380,-5102962,-26911088,11037200,-32891070,15716653,1463780,7376370,13348173,1884099,21168694,925353,-3373223,9789345,-15066764,-10630598,11566591,-14594790,13971114,-2374494,-4336399,-1360588,-7410112,-21402962,-24177734,-31600886,-4211850,-5930799,-2664539,-29017172,5399172,2673383,196423,-148991,2953521,2817733,7312765,-21230640,-11190944,12530795,-11210357,-31423384,1658393,17939914,18588538,-12577678,-6727157,4359867,5435145,19076246,-1170842,-17280824,23784490,6329594,77452,9300847,-2951900,6810964,15927410,-13642223,27146674,-20678398,10164096,-12402828,1968916,1516758,113773,4035370,9030515,-8119971,14241491,1621653,4934410,-6276988,677002,11653568,-9053663,-27511088,12156169,2101436,218705,-336767,9097660,189537,5522969,8549203,-17783216,631008,-3965111,7760315,3185841,-1177199,8993216,-4138955,-19985672,-4824213,6563925,-30443132,-5950105,-11719729,5282081,-9895421,-5102303,2348022,17439896,4955142,7226189,-12649675,6676157,-8580373,17273126,-2450839,8031770,8277407,10077594,6380133,9024213,-6640075,903597,-7451633,1602228,4231121,849237,3498204,10400274,6191414,-8041612,16818928,-38060576,-13624819,-18190920,5736068,-1429583,-14741804,1174891,14757958,7760478,-11258780,14265585,1420200,6097414,20534660,896566,10482471,538102,-16436709,4804913,4358311,-3812034,-18907664,-3997989,15571205,12367295,-9027891,11390721,-8267095,-8523614,-21764194,-32345530,6124834,7117284,-11563727,-23555704,5196766,-1943964,-11184945,-7071130,-8139553,-4338023,14394529,-14294682,-10102567,-5705138,-10872848,-8586526,-22820752,15914167,2423087,12059277,16612019,-3736295,-1879514,-1515021,-12783717,8886956,-12656336,8489033,1386812,4719590,-3015237,-18398482,5514183,-685620,6798373,-233220,6596072,17442700,10875725,-2943720,-3055348,-3208083,8102475,-264933,1876767,9078491,-28003198,1998475,2877373,2684162,-38429584,-27242004,4966879,10795692,-3507030,-570325,15708256,17788326,178029,-10282698,16882614,8293193,5938249,-7926943,12834905,9765007,-18912206,-23395036,-15530746,9665220,-8503302,-12111551,3085061,6400407,4714029,-30969256,-4922036,8199753,19634810,-1926248,1831740,20659202,1676991,-5777368,-823860,11794828,12643012,-234285,17387234,-8205980,-1128962,5093797,30135614,-7592845,4792776,4221767,19657298,2234878,8061049,-1670645,4531177,4101074,-1002316,-6810355,-22596832,-5901526,-2521162,-2988703,13683826,9058765,-8830660,-3049033,-311117,13243343,36940452,-1476773,6395765,4218539,6589218,12345277,-3260072,25383776,6762454,-24309414,-17895440,-10488341,-2462837,2368029,-2541055,18466346,10203934,-44047008,2394758,10434096,21846818,-7818652,-5868685,-3920289,994495,-23936356,-7791815,15119784,-4427003,-47424692,9378845,5874294,5801477,-7693027,-320986,-6669837,-9546191,895513,3858141,-6801527,8574589,-4085817,-30623564,-17085998,8509227,-5830900,-11536799,-4196499,-6079576,-18002946,-4666657,-1131907,-6119944,-2076518,-15958871,-11278469,11170696,-3245904,8116335,-3074135,-7727978,-5764929,-11238663,342641,-17147974,7370236,16001049,10298207,-404576,-1919728,-7746885,21475684,-4104098,12012339,3598990,2857123,-27118036,-8988886,-7602759,-8920515,5175781)
    local b_bias_tuple: (felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt) = (-40931468,-24062290,-76366952,-58199792,29684656,-4058664,19228976,44869608,-91585568,43254072,29741902,-9835167,-20709626,-129220976,14785667,32780856)
    local c_data_tuple: (felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt) = (-76225040,-16919198,30384872,4791774,9478577,-91461192,15589632,-8293286,17436158,23608978,-64540972,9279131,12363286,4562396,-200419424,7647335,-36037404,-38509196,15714069,6209324,-4653593,-138060576,-55347664,11330564,-43595268,20930058,-15473665,10725342,-15133569,-15830465,-4975417,12879796,-35453556,8577480,-11300216,32551142,5370282,-23513136,14267337,-21180462,29579818,-76527176,19043844,46289256,73684576,-20682340,114225,-33869676,10677253,-1757312,23677022,43361820,-104950568,-5948263,-64902120,-56049116,-35473148,-48855804,21536904,-5142073,14106511,22669166,34879912,-70136328,6894751,-16296899,16035786,8137995,-89623544,19787458,30103898,-90902768,15223087,-161957472,9312878,-9738800,45292472,4626354,-98733216,-36904536,12893470,66100656,1868959,16959936,-22555432,70716024,-66370256,26748424,17041076,2426473,10804708,17158916,-15088902,7001235,36172204,8266182,-91891032,-12801814,2612242,-182058144,-40790712,7468472,-40445076,-29054162,5833708,-59317720,-58911876,20783188,-105144152,-12022059,-96022072,-20304978,-8217470,-61681872,-28232796,37986432,22612174,-44235224,21392522,-165939392,12962916,27896916,15901992,18994402,-102536776,-104180160,9715042,-70512352,8087250,-6083326,-10140420,-331896,17253656,-3092320,-1006922,20172962,686978,-64734744,810783,-2208908,-17303620,1272671,-4967807,-47732632,-6617953,-1109890,-2491579,15533237,10621203,20825812,-29379180,3671661,7300057,-4396631,4408286,9944118,-7201758,-5661066,-17204760,8998,-38893976,3323686,-2360924,-483006,-13687196,-4575442,1956088,657421,16392449,3813810,-16098094,-23556658,23538716,-4213996,12446837,20967334,-2277604,12557521,-19961684,-26123912,-44108744,-3931714,5458834,15787867,8619185,6999939,-3873135,-453652,4722418,-46779712,-32628420,-56989180)
    local c_bias_tuple: (felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt, felt) = (-82069568,-36754224,3978405,27097138,42715148,40726260,32614508,36417880,33152830,-5459543,-46184948,-74512536)

    let (__fp__, _) = get_fp_and_pc()

    let x_data_ptr = cast(&x_data_tuple, felt*)
    let a_data_ptr = cast(&a_data_tuple, felt*)
    let a_bias_ptr = cast(&a_bias_tuple, felt*)
    let b_data_ptr = cast(&b_data_tuple, felt*)
    let b_bias_ptr = cast(&b_bias_tuple, felt*)
    let c_data_ptr = cast(&c_data_tuple, felt*)
    let c_bias_ptr = cast(&c_bias_tuple, felt*)


    let (strategy, amount) = calculateStrategy(507700000000000000, 7816255, 591283730, 36, 
        x_data_ptr,
        32, 36, 1152,
        a_data_ptr,
        32,
        a_bias_ptr,
        16, 32, 512,
        b_data_ptr,
        16,
        b_bias_ptr,
        12, 16, 192,
        c_data_ptr,
        12,
        c_bias_ptr,
        100000000
        )
    serialize_word(strategy)
    serialize_word(amount)
    return ()
end

func calculateStrategy{
    pedersen_ptr : HashBuiltin*,
    range_check_ptr
}(remaining_weth: felt, remaining_usdc: felt, weth_price_ratio: felt, x_data_ptr_len : felt,
    x_data_ptr : felt*,
    a_num_rows : felt,
    a_num_cols : felt,
    a_data_ptr_len : felt,
    a_data_ptr : felt*,
    a_bias_ptr_len : felt,
    a_bias_ptr : felt*,
    b_num_rows : felt,
    b_num_cols : felt,
    b_data_ptr_len : felt,
    b_data_ptr : felt*,
    b_bias_ptr_len : felt,
    b_bias_ptr : felt*,
    c_num_rows : felt,
    c_num_cols : felt,
    c_data_ptr_len : felt,
    c_data_ptr : felt*,
    c_bias_ptr_len : felt,
    c_bias_ptr : felt*,
    scale_factor : felt,) -> (strategy: felt, amount: felt):
    alloc_locals
    #let (_owner) = owner.read()
    #let (_l1_contract_address) = l1_contract.read()
    #let (msg_sender) = get_caller_address()
    #assert _owner = msg_sender
    let (weights_len, weights) = three_layer_nn(x_data_ptr_len, x_data_ptr, a_num_rows, a_num_cols, a_data_ptr_len, a_data_ptr, 
        a_bias_ptr_len, a_bias_ptr, b_num_rows, b_num_cols, b_data_ptr_len, b_data_ptr, b_bias_ptr_len, b_bias_ptr,
        c_num_rows, c_num_cols, c_data_ptr_len, c_data_ptr, c_bias_ptr_len, c_bias_ptr, scale_factor)
    let (temp) = getMaxWeight(weights_len, weights, 0, 0)
    #local max_index: felt
    #assert max_index = temp
    let (max_index) = alloc()
    assert [max_index] = temp
    let (amount: felt*) = alloc()
    let (strategy: felt*) = alloc()

    let amount_usdc_max = 20000000
    let amount_usdc_extreme = 10000000
    let amount_usdc_large = 5000000

    let amount_weth_max = amount_usdc_max * weth_price_ratio
    let amount_weth_extreme = amount_usdc_extreme * weth_price_ratio
    let amount_weth_large = amount_usdc_large * weth_price_ratio

    let (is_overflow_weth_max) = is_le(remaining_weth, amount_weth_max)
    let (is_overflow_weth_extreme) = is_le(remaining_weth, amount_weth_extreme)
    let (is_overflow_weth_large) = is_le(remaining_weth, amount_weth_large)

    let (is_overflow_usdc_large) = is_le(remaining_usdc, amount_usdc_large)
    let (is_overflow_usdc_extreme) = is_le(remaining_usdc, amount_usdc_extreme)
    let (is_overflow_usdc_max) = is_le(remaining_usdc, amount_usdc_max)

    if [max_index] == PRICE_DOWN_MAX:
        if is_overflow_weth_max == 1:
            assert [amount] = remaining_weth
        else:
            assert [amount] = amount_weth_max
        end
        assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_DOWN_EXTREME:
        if is_overflow_weth_extreme == 1:
            assert [amount] = remaining_weth
        else:
            assert [amount] = amount_weth_extreme
        end
        assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_DOWN_LARGE:
        if is_overflow_weth_large == 1:
            assert [amount] = remaining_weth
        else:
            assert [amount] = amount_weth_large
        end
        assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_DOWN_MID:
       # assert [strategy] = SELL_STRATEGY
       #return (strategy=NULL_STRATEGY, amount=0)
       if is_overflow_weth_large == 1:
            assert [amount] = remaining_weth
        else:
            assert [amount] = amount_weth_large
        end
        assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_DOWN_SMALL:
        #assert [strategy] = SELL_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
        # if is_overflow_weth_large == 1:
        #     assert [amount] = remaining_weth
        # else:
        #     assert [amount] = amount_weth_large
        # end
        # assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_DOWN_MIN:
        #assert [strategy] = SELL_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
        # if is_overflow_weth_large == 1:
        #     assert [amount] = remaining_weth
        # else:
        #     assert [amount] = amount_weth_large
        # end
        # assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_UP_MIN:
        #assert [strategy] = BUY_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
        # if is_overflow_usdc_large == 1:
        #     assert [amount] = remaining_usdc
        # else:
        #     assert [amount] = amount_usdc_large
        # end
        # assert [strategy] = BUY_STRATEGY
    end
    if [max_index] == PRICE_UP_SMALL:
        #assert [strategy] = BUY_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
        # if is_overflow_usdc_large == 1:
        #     assert [amount] = remaining_usdc
        # else:
        #     assert [amount] = amount_usdc_large
        # end
        # assert [strategy] = BUY_STRATEGY

    end
    if [max_index] == PRICE_UP_MID:
        #assert [strategy] = BUY_STRATEGY
        #return (strategy=NULL_STRATEGY, amount=0)
        if is_overflow_usdc_large == 1:
            assert [amount] = remaining_usdc
        else:
            assert [amount] = amount_usdc_large
        end
        assert [strategy] = BUY_STRATEGY

    end
    if [max_index] == PRICE_UP_LARGE:
        if is_overflow_usdc_large == 1:
            assert [amount] = remaining_usdc
        else:
            assert [amount] = amount_usdc_large
        end
        assert [strategy] = BUY_STRATEGY
    end
    if [max_index] == PRICE_UP_EXTREME:
        if is_overflow_usdc_extreme == 1:
            assert [amount] = remaining_usdc
        else:
            assert [amount] = amount_usdc_extreme
        end
        assert [strategy] = BUY_STRATEGY
    end
    if [max_index] == PRICE_UP_MAX:
        if is_overflow_usdc_max == 1:
            assert [amount] = remaining_usdc
        else:
            assert [amount] = amount_usdc_max
        end
        assert [strategy] = BUY_STRATEGY
    end

    if [amount] == 0:
        return (strategy=NULL_STRATEGY, amount=0)
    end

    let (message_payload : felt*) = alloc()
    assert message_payload[0] = [strategy]
    assert message_payload[1] = [amount]
    # send_message_to_l1(
    #     to_address=_l1_contract_address,
    #     payload_size=2,
    #     payload=message_payload,
    # )
    #strategy_sent_to_l2.emit(strategy=[strategy], amount=[amount])
    return (strategy=[strategy], amount=[amount])
end

func getMaxWeight{range_check_ptr}(weights_len: felt, weights: felt*, curr_check: felt, curr_max_index: felt) -> (max_index: felt):
    if curr_check == weights_len:
        return (max_index=curr_max_index)
    else:
        let (is_max) = is_le(weights[curr_max_index], weights[curr_check])
        if is_max == 1:
            return getMaxWeight(weights_len, weights, curr_check+1, curr_check)
        end
        return getMaxWeight(weights_len, weights, curr_check+1, curr_max_index)
    end
end

func ryansFunc{
    range_check_ptr,
}() -> (weights_len: felt, weights: felt*):
    let (return_vector : felt*) = alloc()
    assert return_vector[PRICE_DOWN_MAX] = 0
    assert return_vector[PRICE_DOWN_EXTREME] = 0
    assert return_vector[PRICE_DOWN_LARGE] = 0
    assert return_vector[PRICE_DOWN_MID] = 0
    assert return_vector[PRICE_DOWN_SMALL] = 0
    assert return_vector[PRICE_DOWN_MIN] = 0
    assert return_vector[PRICE_UP_MIN]  = 0
    assert return_vector[PRICE_UP_SMALL] = 0
    assert return_vector[PRICE_UP_MID] = 0
    assert return_vector[PRICE_UP_LARGE] = 0
    assert return_vector[PRICE_UP_EXTREME] = 0
    assert return_vector[PRICE_UP_MAX] = 1
    return (weights_len=12, weights=return_vector)
end

# ------------------------------------ Data structs ------------------------------------
struct FlattenedMatrix:
    member data : felt*
    member num_rows : felt
    member num_cols : felt
end
struct BasicVector:
    member data_len : felt
    member data_ptr : felt*
end
# ------------------------------------ Relu ------------------------------------
# --- Performs a relu (taken directly from GuiltyGyoza; all credit to him!) ---
func _relu{range_check_ptr}(x : felt) -> (y : felt):
    let (bool_pos) = is_le(0, x)
    let y = bool_pos * x
    return (y=y)
end
# --- Recursive helper. Iterated index is `idx` ---
func _vector_relu{range_check_ptr}(x_vec : BasicVector, result_vec : BasicVector, idx : felt):
    if idx == x_vec.data_len:
        return ()
    end
    # --- Compute, assign, and recurse ---
    let (relu_x : felt) = _relu(x_vec.data_ptr[idx])
    assert result_vec.data_ptr[idx] = relu_x
    _vector_relu(x_vec=x_vec, result_vec=result_vec, idx=idx + 1)
    return ()
end
# --- Wrapper fn + sanitycheck ---
# @view
func vector_relu{range_check_ptr}(x_vec : BasicVector, result_vec : BasicVector):
    # --- Sanitycheck ---
    assert x_vec.data_len = result_vec.data_len
    # --- Kick off the recursion ---
    _vector_relu(x_vec=x_vec, result_vec=result_vec, idx=0)
    return ()
end
# ------------------------------------ Matvmul ------------------------------------
# --- Computes dot product of an entire matrix row (dot) vector ---
func compute_matrow_dot_vector(
    flattened_matrix : FlattenedMatrix, vector : BasicVector, row : felt, col : felt
) -> (result : felt):
    alloc_locals
    # --- Reached end of matrix ---
    if col == flattened_matrix.num_cols:
        return (0)
    end
    # --- Single multiplication based on offset ---
    local matrix_weight = flattened_matrix.data[flattened_matrix.num_cols * row + col]
    local result = matrix_weight * vector.data_ptr[col]
    # --- Recurse over rest of row/vector ---
    let (rest) = compute_matrow_dot_vector(
        flattened_matrix=flattened_matrix, vector=vector, row=row, col=col + 1
    )
    # --- Result is the sum ---
    return (result + rest)
end
func compute_matvmul_by_row(
    flattened_matrix : FlattenedMatrix,
    vector : BasicVector,
    result_vector : BasicVector,
    row : felt,
):
    # --- End of matrix ---
    if row == flattened_matrix.num_rows:
        return ()
    end
    # --- Compute row dot product ---
    let (row_result) = compute_matrow_dot_vector(
        flattened_matrix=flattened_matrix, vector=vector, row=row, col=0
    )
    # --- Perform assignment with offset and recurse ---
    assert result_vector.data_ptr[row] = row_result
    compute_matvmul_by_row(
        flattened_matrix=flattened_matrix, vector=vector, result_vector=result_vector, row=row + 1
    )
    return ()
end
func compute_matvmul(
    flattened_matrix : FlattenedMatrix, vector : BasicVector, result_vector : BasicVector
):
    # --- Multiply first row by vector. Write result into first result_vector slot. ---
    # --- Recurse on row number until it equals m ---
    compute_matvmul_by_row(
        flattened_matrix=flattened_matrix, vector=vector, result_vector=result_vector, row=0
    )
    return ()
end
# ------------------------------------ Vector add ------------------------------------
# --- Adds two vectors together and stores the result ---
func vec_add{range_check_ptr}(v1 : BasicVector, v2 : BasicVector, result : BasicVector):
    # --- Sanitycheck ---
    assert v1.data_len = v2.data_len
    # --- Base: Just return ---
    if v1.data_len == 0:
        return ()
    end
    # --- Call internal add fn ---
    _vec_add(v1=v1, v2=v2, result=result, idx=0)
    return ()
end
# --- Iterating over idx ---
func _vec_add{range_check_ptr}(
    v1 : BasicVector, v2 : BasicVector, result : BasicVector, idx : felt
):
    if idx == result.data_len:
        return ()
    end
    # --- Do assignment, then recurse ---
    assert result.data_ptr[idx] = v1.data_ptr[idx] + v2.data_ptr[idx]
    _vec_add(v1=v1, v2=v2, result=result, idx=idx + 1)
    return ()
end
# ------------------------------------ Scale vector ------------------------------------
# --- Helper ---
func _scale_vector{range_check_ptr}(
    v : BasicVector, scaled_v : BasicVector, scale_factor : felt, idx : felt
):
    if idx == v.data_len:
        return ()
    end
    # --- 10^24 ~ 2^80 ---
    # Note that RC_BOUND = 2**128
    let (quotient : felt, remainder : felt) = signed_div_rem(
        value=v.data_ptr[idx], div=scale_factor, bound=1000000000000000000000000
    )
    assert scaled_v.data_ptr[idx] = quotient
    _scale_vector(v=v, scaled_v=scaled_v, scale_factor=scale_factor, idx=idx + 1)
    return ()
end
# --- Wrapper ---
func scale_vector{range_check_ptr}(v : BasicVector, scaled_v : BasicVector, scale_factor : felt):
    # --- Sanitycheck ---
    assert v.data_len = scaled_v.data_len
    # --- Kick off recursive helper ---
    _scale_vector(v=v, scaled_v=scaled_v, scale_factor=scale_factor, idx=0)
    return ()
end
# ------------------------------------ Linear layer ------------------------------------
# --- Idea here is to ---
# a) couple the matmul and bias ops
# b) perform re-scaling (since we're multiplying)
# c) take care of intermediate reps
func linear1d_forward{range_check_ptr}(
    x : BasicVector,
    a : FlattenedMatrix,
    a_bias : BasicVector,
    out : BasicVector,
    scale_factor : felt,
):
    alloc_locals
    # --- Sanitycheck (TODO: Is this necessary?) ---
    assert a.num_cols = x.data_len
    assert a.num_rows = out.data_len
    assert a.num_rows = a_bias.data_len
    # --- Alloc intermediate repr ---
    let (post_weights : felt*) = alloc()
    local post_weights_vec : BasicVector = BasicVector(data_len=a.num_rows, data_ptr=post_weights)
    let (scaled_post_weights : felt*) = alloc()
    local scaled_post_weights_vec : BasicVector = BasicVector(data_len=a.num_rows, data_ptr=scaled_post_weights)
    # --- Perform matvmul ---
    compute_matvmul(flattened_matrix=a, vector=x, result_vector=post_weights_vec)
    # --- Perform re-scaling ---
    scale_vector(v=post_weights_vec, scaled_v=scaled_post_weights_vec, scale_factor=scale_factor)
    # --- Add bias ---
    vec_add(v1=scaled_post_weights_vec, v2=a_bias, result=out)
    return ()
end
# ------------------------------------ 3-layer nn ------------------------------------
# --- Parameters ---
# x: Input data vector
# a: First matrix
# b: Second matrix
# --- Architecture ---
# c @ relu(b @ relu(a @ x + a_bias) + b_bias) + c_bias
func three_layer_nn{pedersen_ptr : HashBuiltin*, range_check_ptr}(
    x_data_ptr_len : felt,
    x_data_ptr : felt*,
    a_num_rows : felt,
    a_num_cols : felt,
    a_data_ptr_len : felt,
    a_data_ptr : felt*,
    a_bias_ptr_len : felt,
    a_bias_ptr : felt*,
    b_num_rows : felt,
    b_num_cols : felt,
    b_data_ptr_len : felt,
    b_data_ptr : felt*,
    b_bias_ptr_len : felt,
    b_bias_ptr : felt*,
    c_num_rows : felt,
    c_num_cols : felt,
    c_data_ptr_len : felt,
    c_data_ptr : felt*,
    c_bias_ptr_len : felt,
    c_bias_ptr : felt*,
    scale_factor : felt,
) -> (output_data_ptr_len : felt, output_data_ptr : felt*):
    alloc_locals
    # --- Sanitycheck part 1: Matrix shapes ---
    assert a_data_ptr_len = a_num_rows * a_num_cols
    assert b_data_ptr_len = b_num_rows * b_num_cols
    assert c_data_ptr_len = c_num_rows * c_num_cols
    # --- Sanitycheck part 2: Dimensional analysis ---
    assert a_num_cols = x_data_ptr_len
    assert a_num_rows = b_num_cols
    assert b_num_rows = c_num_cols
    # --- Construct data structures ---
    local a_matrix : FlattenedMatrix = FlattenedMatrix(
        data=a_data_ptr, num_rows=a_num_rows, num_cols=a_num_cols
        )
    local a_bias : BasicVector = BasicVector(
        data_len=a_bias_ptr_len, data_ptr=a_bias_ptr
        )
    local b_matrix : FlattenedMatrix = FlattenedMatrix(
        data=b_data_ptr, num_rows=b_num_rows, num_cols=b_num_cols
        )
    local b_bias : BasicVector = BasicVector(
        data_len=b_bias_ptr_len, data_ptr=b_bias_ptr
        )
    local c_matrix : FlattenedMatrix = FlattenedMatrix(
        data=c_data_ptr, num_rows=c_num_rows, num_cols=c_num_cols
        )
    local c_bias : BasicVector = BasicVector(
        data_len=c_bias_ptr_len, data_ptr=c_bias_ptr
        )
    # --- Construct input/intermediate data structures ---
    let (x1_data_ptr : felt*) = alloc()  # After first linear layer
    let (x1_relu_data_ptr : felt*) = alloc()  # After first relu
    let (x2_data_ptr : felt*) = alloc()  # After second linear layer
    let (x2_relu_data_ptr : felt*) = alloc()  # After second relu
    let (x3_data_ptr : felt*) = alloc()  # After third linear layer
    local x : BasicVector = BasicVector(
        data_len=x_data_ptr_len, data_ptr=x_data_ptr
        )
    local x1 : BasicVector = BasicVector(
        data_len=a_num_rows, data_ptr=x1_data_ptr
        )
    local x1_relu : BasicVector = BasicVector(
        data_len=a_num_rows, data_ptr=x1_relu_data_ptr
        )
    local x2 : BasicVector = BasicVector(
        data_len=b_num_rows, data_ptr=x2_data_ptr
        )
    local x2_relu : BasicVector = BasicVector(
        data_len=b_num_rows, data_ptr=x2_relu_data_ptr
        )
    local x3 : BasicVector = BasicVector(
        data_len=c_num_rows, data_ptr=x3_data_ptr
        )
    # --- First layer ---
    linear1d_forward(x=x, a=a_matrix, a_bias=a_bias, out=x1, scale_factor=scale_factor)
    # --- Compute first relu ---
    vector_relu(x_vec=x1, result_vec=x1_relu)
    # -- Second layer: Matmul, then add bias ---
    linear1d_forward(x=x1_relu, a=b_matrix, a_bias=b_bias, out=x2, scale_factor=scale_factor)
    # --- Compute second relu ---
    vector_relu(x_vec=x2, result_vec=x2_relu)
    # --- Third layer: Matmul, then add bias ---
    linear1d_forward(x=x2_relu, a=c_matrix, a_bias=c_bias, out=x3, scale_factor=scale_factor)
    # --- Return output ---
    # TODO(ryancao): NOTE that the output is `scale_factor` times too large!
    # This doesn't matter for classification but may affect a regression
    # or other kind of model. Can either re-scale here or post-compute
    # (to preserve precision).
    return (output_data_ptr_len=x3.data_len, output_data_ptr=x3.data_ptr)
end