/* ==========================================================================
   Collocation (cụm từ đi kèm) theo trình độ CEFR & chủ đề — chỉ trang tiếng Anh.
   Mỗi chủ đề = 1 bài 8 cụm. Mỗi ngày mỗi trình độ có 1 chủ đề (js/daily.js → Daily.colloc),
   xoay vòng hết các chủ đề của cấp rồi mới lặp lại.

   Mỗi dòng cụm từ: "cụm|nghĩa|câu ví dụ|từ sai 1,từ sai 2|ghi chú (tuỳ chọn)"
     - [từ] trong ngoặc vuông = từ được luyện (bị che trong bài tập).
     - Câu ví dụ cũng đánh dấu [từ] đúng dạng trong câu (có thể chia thì: [made]).
     - "từ sai" phải THẬT SỰ sai/không tự nhiên trong cụm này (vd do a decision ✗).
       Đừng đưa từ đúng khác (take a shower / have a shower đều đúng → không dùng "have" làm từ sai).
   Thêm chủ đề: thêm 1 object vào mảng, id duy nhất dạng "<cấp>-<tên>".
   ========================================================================== */
window.COLLOCATIONS = [
  /* ============================== A1 ============================== */
  { id: "a1-daily", level: "A1", icon: "⏰", en: "Daily routine", vi: "Sinh hoạt hằng ngày", items: [
    "[have] breakfast|ăn sáng|I [have] breakfast at seven.|do,make",
    "[get] up early|dậy sớm|I [get] up early on Mondays.|make,do",
    "[take] a shower|tắm vòi sen|I [take] a shower every morning.|make,do|Anh-Anh cũng nói “have a shower”.",
    "[brush] my teeth|đánh răng|I [brush] my teeth twice a day.|wash,make",
    "[go] to bed|đi ngủ|I usually [go] to bed at eleven.|make,take",
    "[do] the housework|làm việc nhà|We [do] the housework on Sundays.|make,play|“do” cho việc nhà: do the cooking, do the cleaning.",
    "[catch] the bus|bắt xe buýt|I [catch] the bus to work.|hold,keep|Cũng nói “take / get the bus”.",
    "[watch] TV|xem TV|We [watch] TV after dinner.|see,look"
  ] },
  { id: "a1-food", level: "A1", icon: "🍜", en: "Food & drink", vi: "Đồ ăn thức uống", items: [
    "[strong] coffee|cà phê đặc|I like [strong] coffee in the morning.|powerful,hard|Ngược lại: weak coffee (cà phê loãng).",
    "[fast] food|đồ ăn nhanh|Don't eat too much [fast] food.|quick,rapid",
    "[make] a cup of tea|pha một tách trà|Can you [make] a cup of tea for me?|do,cook",
    "[cook] dinner|nấu bữa tối|My dad [cooks] dinner every evening.|do,build",
    "[order] food|gọi đồ ăn|Let's [order] food tonight.|command,demand",
    "[fresh] fruit|trái cây tươi|She eats [fresh] fruit every day.|new,young",
    "a [glass] of water|một cốc nước|Can I have a [glass] of water, please?|piece,slice",
    "[set] the table|bày bàn ăn|Please [set] the table for dinner.|put,make"
  ] },
  { id: "a1-home", level: "A1", icon: "🏠", en: "Home & family", vi: "Nhà cửa & gia đình", items: [
    "[make] the bed|dọn giường|I [make] my bed every morning.|do,fix",
    "[do] the washing-up|rửa bát|I [do] the washing-up after dinner.|make,clean",
    "[turn] on the light|bật đèn|Please [turn] on the light.|open,make|Người Việt hay nói nhầm “open the light” ✗.",
    "[clean] my room|dọn phòng|I [clean] my room on Saturdays.|wash,make",
    "[big] family|gia đình đông người|I come from a [big] family.|tall,high|Cũng nói “large family”.",
    "[feed] the cat|cho mèo ăn|Can you [feed] the cat today?|eat,give",
    "[take] out the rubbish|đổ rác|I [take] out the rubbish every evening.|make,do|Mỹ: take out the trash.",
    "[spend] time with family|dành thời gian cho gia đình|I [spend] time with my family at weekends.|use,pay"
  ] },
  { id: "a1-school", level: "A1", icon: "✏️", en: "Classroom", vi: "Lớp học", items: [
    "[do] homework|làm bài tập về nhà|I [do] my homework after dinner.|make,write",
    "[ask] a question|đặt câu hỏi|Can I [ask] a question?|make,say|“make a question” ✗ là lỗi rất phổ biến.",
    "[take] notes|ghi chép|I [take] notes in class.|do,get",
    "[learn] by heart|học thuộc lòng|Please [learn] these words by heart.|study,read",
    "[pass] an exam|thi đỗ|I hope I [pass] the exam.|win,get",
    "[make] a mistake|mắc lỗi|Don't worry if you [make] a mistake.|do,have|make vs do: make = tạo ra (mistake, noise, plan); do = làm việc/nhiệm vụ.",
    "[give] an answer|đưa ra câu trả lời|Please [give] an answer in English.|say,tell",
    "[pay] attention|chú ý|Please [pay] attention to the teacher.|make,do"
  ] },
  { id: "a1-time", level: "A1", icon: "📅", en: "Time & weekend", vi: "Thời gian & cuối tuần", items: [
    "[have] a good time|vui vẻ|We [had] a good time at the party.|make,do",
    "[take] a break|nghỉ giải lao|Let's [take] a break for ten minutes.|make,do|Anh-Anh cũng nói “have a break”.",
    "[go] shopping|đi mua sắm|We [go] shopping on Saturdays.|make,play",
    "[play] football|chơi bóng đá|The kids [play] football after school.|do,make",
    "[on] time|đúng giờ|The train is always [on] time.|at,by|“in time” = kịp lúc (nghĩa khác).",
    "[free] time|thời gian rảnh|What do you do in your [free] time?|empty,open",
    "[next] week|tuần sau|See you [next] week!|after,later",
    "[wait] for the bus|chờ xe buýt|We [waited] for the bus for 20 minutes.|expect,stay"
  ] },

  /* ============================== A2 ============================== */
  { id: "a2-shopping", level: "A2", icon: "🛍️", en: "Shopping", vi: "Mua sắm", items: [
    "[pay] by card|trả bằng thẻ|Can I [pay] by card?|buy,give",
    "[try] on a shirt|mặc thử áo|Can I [try] on this shirt?|test,check",
    "[good] value|đáng đồng tiền|This jacket is [good] value.|high,big",
    "[on] sale|đang giảm giá|These shoes are [on] sale this week.|in,at",
    "[make] a list|lập danh sách|I always [make] a shopping list.|do,build",
    "[ask] for a discount|xin giảm giá|You can [ask] for a discount.|say,tell",
    "[high] prices|giá cao|Prices are very [high] here.|expensive,tall|“expensive prices” ✗ — giá thì high/low, đồ vật mới expensive/cheap.",
    "[get] a refund|được hoàn tiền|I took it back and [got] a refund.|make,win"
  ] },
  { id: "a2-weather", level: "A2", icon: "🌦️", en: "Weather", vi: "Thời tiết", items: [
    "[heavy] rain|mưa to|There was [heavy] rain last night.|big,strong|Mưa to = heavy rain, không nói “strong rain” ✗.",
    "[strong] wind|gió mạnh|A [strong] wind blew the leaves away.|heavy,thick",
    "[bright] sunshine|nắng chói chang|We enjoyed the [bright] sunshine.|loud,heavy",
    "[thick] fog|sương mù dày đặc|The plane was late because of [thick] fog.|fat,wide",
    "[light] rain|mưa nhỏ|It's only [light] rain — let's go.|small,thin|“small rain” ✗ là dịch từng chữ.",
    "[weather] forecast|dự báo thời tiết|Did you check the [weather] forecast?|climate,sky",
    "[clear] sky|bầu trời quang|At night there was a [clear] sky full of stars.|clean,empty",
    "[get] wet|bị ướt|Take an umbrella or you'll [get] wet.|make,do"
  ] },
  { id: "a2-health", level: "A2", icon: "🩺", en: "Health", vi: "Sức khỏe", items: [
    "[catch] a cold|bị cảm lạnh|I [caught] a cold last week.|hold,make",
    "[take] medicine|uống thuốc|[Take] this medicine twice a day.|Drink,Eat|Uống thuốc = take medicine, không phải “drink medicine” ✗.",
    "[see] a doctor|đi khám bác sĩ|You should [see] a doctor.|meet,look",
    "[have] a headache|bị đau đầu|I [have] a terrible headache.|make,do",
    "[do] exercise|tập thể dục|I [do] exercise three times a week.|make,play",
    "[keep] fit|giữ dáng|He swims to [keep] fit.|hold,make",
    "[get] enough sleep|ngủ đủ giấc|Try to [get] enough sleep.|make,take",
    "[feel] better|thấy đỡ hơn|I [feel] better today.|do,make"
  ] },
  { id: "a2-free", level: "A2", icon: "🎸", en: "Free time", vi: "Giải trí", items: [
    "[take] photos|chụp ảnh|We [took] lots of photos.|make,do",
    "[listen] to music|nghe nhạc|I [listen] to music on the bus.|watch,see",
    "[go] for a walk|đi dạo|Let's [go] for a walk.|make,do",
    "[read] the news|đọc tin tức|I [read] the news every morning.|learn,study",
    "[join] a club|tham gia câu lạc bộ|She [joined] a running club.|participate,go",
    "[have] fun|vui chơi|[Have] fun at the party!|Make,Do|Cẩn thận: “make fun of someone” = chế giễu ai đó.",
    "[play] the guitar|chơi đàn guitar|My son [plays] the guitar.|do,make",
    "[watch] a film|xem phim|Let's [watch] a film tonight.|look,read|Cũng nói “see a film” (thường là ở rạp)."
  ] },
  { id: "a2-travel", level: "A2", icon: "🧳", en: "Getting around", vi: "Đi lại", items: [
    "[book] a hotel|đặt khách sạn|We [booked] a hotel near the beach.|order,buy",
    "[miss] the train|lỡ tàu|Hurry or we'll [miss] the train!|lose,fail",
    "[pack] a suitcase|xếp vali|I need to [pack] my suitcase.|fill,make",
    "[go] on holiday|đi nghỉ|We [go] on holiday every summer.|make,do",
    "[check] in|làm thủ tục nhận phòng / lên máy bay|You can [check] in at 2 p.m.|look,get",
    "[get] lost|bị lạc|We [got] lost in the old town.|make,go",
    "[ask] for directions|hỏi đường|Let's [ask] for directions.|say,tell",
    "[return] ticket|vé khứ hồi|A [return] ticket to London, please.|back,double|Mỹ: round-trip ticket."
  ] },

  /* ============================== B1 ============================== */
  { id: "b1-work", level: "B1", icon: "💼", en: "Work & office", vi: "Công việc", items: [
    "[meet] a deadline|kịp hạn chót|We worked late to [meet] the deadline.|catch,win",
    "[hold] a meeting|tổ chức cuộc họp|We [hold] a meeting every Monday.|make,do",
    "[apply] for a job|nộp đơn xin việc|She [applied] for a job at a bank.|ask,request",
    "[run] a business|điều hành doanh nghiệp|My aunt [runs] a small business.|drive,walk",
    "[make] progress|tiến bộ, có tiến triển|We are [making] good progress.|do,get",
    "[take] responsibility|chịu trách nhiệm|You need to [take] responsibility for your work.|make,get",
    "[work] overtime|làm thêm giờ|I had to [work] overtime last week.|make,take",
    "[get] a promotion|được thăng chức|She [got] a promotion last year.|make,catch"
  ] },
  { id: "b1-people", level: "B1", icon: "🤝", en: "Relationships", vi: "Các mối quan hệ", items: [
    "[make] friends|kết bạn|It's easy to [make] friends at university.|do,get",
    "[keep] in touch|giữ liên lạc|Let's [keep] in touch after the course.|hold,make|Cũng nói “stay in touch”.",
    "[fall] in love|phải lòng|They [fell] in love in Paris.|drop,go",
    "[get] married|kết hôn|They [got] married last spring.|make,do",
    "[have] an argument|cãi nhau|They [had] an argument about money.|make,do",
    "[lose] touch|mất liên lạc|We [lost] touch after school.|miss,drop",
    "[close] friend|bạn thân|Mai is my [close] friend.|near,deep",
    "[break] up|chia tay|They [broke] up after three years.|cut,fall"
  ] },
  { id: "b1-money", level: "B1", icon: "💰", en: "Money", vi: "Tiền bạc", items: [
    "[save] money|tiết kiệm tiền|I'm trying to [save] money for a car.|store,collect",
    "[waste] money|phí tiền|Don't [waste] money on things you don't need.|spoil,kill",
    "[borrow] money|vay tiền|Can I [borrow] some money from you?|lend,rent|borrow = mượn (từ ai); lend = cho mượn (cho ai).",
    "[cost] a fortune|rất đắt, tốn cả gia tài|That car [cost] a fortune.|take,make",
    "[make] money|kiếm tiền|He [makes] money by selling photos online.|do,find",
    "[pay] back|trả lại (tiền nợ)|I'll [pay] you back tomorrow.|return,send",
    "[tight] budget|ngân sách eo hẹp|We're on a [tight] budget this month.|narrow,thin",
    "[change] money|đổi tiền|Where can I [change] money?|switch,turn"
  ] },
  { id: "b1-travel", level: "B1", icon: "✈️", en: "Travel", vi: "Du lịch", items: [
    "[catch] a flight|bắt chuyến bay|We have to [catch] a flight at 6 a.m.|hold,reach",
    "[go] sightseeing|đi tham quan|We [went] sightseeing in Hanoi.|make,take",
    "[travel] light|đi du lịch gọn nhẹ|I always [travel] light — just one bag.|walk,move",
    "[long] journey|chuyến đi dài|It was a [long] journey by bus.|far,tall",
    "[book] in advance|đặt trước|It's cheaper to [book] in advance.|order,call",
    "[set] off|khởi hành|We [set] off at dawn.|put,go",
    "[jet] lag|mệt do lệch múi giờ|I had terrible [jet] lag after the flight.|plane,air",
    "[local] food|món ăn địa phương|You should try the [local] food.|area,place"
  ] },
  { id: "b1-study", level: "B1", icon: "🎓", en: "Studying", vi: "Học tập", items: [
    "[do] research|nghiên cứu|I need to [do] some research for my essay.|make,play",
    "[take] an exam|dự thi|I [take] my driving exam next week.|make,play|Anh-Anh cũng nói “sit / do an exam”.",
    "[fail] an exam|thi trượt|He [failed] his exam but tried again.|lose,miss",
    "[make] an effort|cố gắng, nỗ lực|Please [make] an effort to speak English.|do,give",
    "[get] a degree|lấy bằng|She [got] a degree in economics.|win,make",
    "[learn] from mistakes|học từ sai lầm|We all [learn] from our mistakes.|study,teach",
    "[attend] a class|dự lớp học|You must [attend] every class.|assist,visit|“assist” ✗ = giúp đỡ, không phải tham dự.",
    "[improve] my English|cải thiện tiếng Anh|I watch videos to [improve] my English.|grow,raise"
  ] },
  { id: "b1-feelings", level: "B1", icon: "😊", en: "Feelings", vi: "Cảm xúc", items: [
    "[lose] my temper|nổi nóng|I [lost] my temper with the kids.|miss,break",
    "[feel] nervous|thấy hồi hộp|I always [feel] nervous before an exam.|make,do",
    "[bitterly] disappointed|thất vọng cay đắng|She was [bitterly] disappointed.|strongly,heavily",
    "[burst] into tears|òa khóc|She [burst] into tears when she heard the news.|break,fall",
    "[bored] to death|chán muốn chết|I was [bored] to death in that meeting.|boring,bore|bored = (người) thấy chán; boring = (vật) gây chán.",
    "[keep] calm|giữ bình tĩnh|Try to [keep] calm.|hold,make|Cũng nói “stay calm”.",
    "[deeply] moved|xúc động sâu sắc|I was [deeply] moved by the film.|highly,strongly",
    "[cheer] up|vui lên|[Cheer] up! It's not the end of the world.|Laugh,Happy"
  ] },

  /* ============================== B2 ============================== */
  { id: "b2-business", level: "B2", icon: "📈", en: "Business", vi: "Kinh doanh", items: [
    "[launch] a product|ra mắt sản phẩm|The company will [launch] a new product in May.|throw,start",
    "[reach] an agreement|đạt được thỏa thuận|The two sides finally [reached] an agreement.|arrive,win",
    "[close] a deal|chốt hợp đồng|We [closed] the deal on Friday.|shut,end",
    "[cut] costs|cắt giảm chi phí|We need to [cut] costs this year.|drop,break",
    "[gain] market share|giành thị phần|They [gained] market share in Asia.|catch,collect",
    "[go] bankrupt|phá sản|The firm [went] bankrupt in 2020.|fall,get",
    "[fierce] competition|cạnh tranh khốc liệt|There is [fierce] competition in this market.|angry,heavy",
    "[make] a profit|có lãi|The shop [made] a profit in its first year.|do,win"
  ] },
  { id: "b2-environment", level: "B2", icon: "🌱", en: "Environment", vi: "Môi trường", items: [
    "[climate] change|biến đổi khí hậu|[Climate] change affects everyone.|Weather,Air",
    "[reduce] emissions|giảm khí thải|Countries must [reduce] emissions.|decline,shorten",
    "[renewable] energy|năng lượng tái tạo|Solar power is a form of [renewable] energy.|renewed,returning",
    "[endangered] species|loài có nguy cơ tuyệt chủng|The tiger is an [endangered] species.|dangerous,dangered",
    "[raise] awareness|nâng cao nhận thức|The campaign aims to [raise] awareness of plastic waste.|rise,lift|raise + tân ngữ (raise awareness); rise không có tân ngữ (prices rise).",
    "[natural] resources|tài nguyên thiên nhiên|We must protect our [natural] resources.|nature,wild",
    "[pose] a threat|gây ra mối đe dọa|Plastic [poses] a serious threat to sea life.|put,do",
    "[take] action|hành động|We need to [take] action now.|make,do"
  ] },
  { id: "b2-media", level: "B2", icon: "📱", en: "Media & technology", vi: "Truyền thông & công nghệ", items: [
    "[go] viral|lan truyền chóng mặt|The video [went] viral overnight.|turn,run",
    "[breaking] news|tin nóng|Here is some [breaking] news.|broken,cracking",
    "[make] headlines|lên trang nhất|The story [made] headlines around the world.|do,write",
    "[download] an app|tải ứng dụng|[Download] the app to book a table.|Load,Take",
    "[spread] misinformation|lan truyền thông tin sai lệch|Some accounts [spread] misinformation.|expand,stretch",
    "[social] media|mạng xã hội|I spend too much time on [social] media.|society,public",
    "[screen] time|thời gian dùng màn hình|We limit the kids' [screen] time.|monitor,display",
    "[post] a comment|đăng bình luận|Feel free to [post] a comment below.|send,throw"
  ] },
  { id: "b2-lifestyle", level: "B2", icon: "🥗", en: "Health & lifestyle", vi: "Lối sống lành mạnh", items: [
    "[balanced] diet|chế độ ăn cân bằng|A [balanced] diet keeps you healthy.|equal,even",
    "[lead] a healthy lifestyle|sống lành mạnh|He [leads] a healthy lifestyle.|drive,make",
    "[make] a full recovery|hồi phục hoàn toàn|She [made] a full recovery after surgery.|do,get",
    "[sedentary] lifestyle|lối sống ít vận động|A [sedentary] lifestyle is bad for your heart.|sitting,seated",
    "[cut] down on sugar|ăn bớt đường|I'm trying to [cut] down on sugar.|lower,drop",
    "[chronic] pain|đau mãn tính|He suffers from [chronic] pain.|long,old",
    "[boost] the immune system|tăng cường hệ miễn dịch|Sleep helps [boost] your immune system.|push,lift",
    "[side] effects|tác dụng phụ|This medicine has few [side] effects.|sub,extra"
  ] },
  { id: "b2-problems", level: "B2", icon: "🧩", en: "Problems & solutions", vi: "Vấn đề & giải pháp", items: [
    "[solve] a problem|giải quyết vấn đề|We need to [solve] this problem quickly.|repair,open",
    "[face] a challenge|đối mặt thách thức|Many small firms [face] a challenge this year.|front,look",
    "[come] up with a solution|nghĩ ra giải pháp|She [came] up with a clever solution.|go,get",
    "[find] a way|tìm ra cách|We'll [find] a way to fix it.|search,look",
    "[tackle] an issue|xử lý một vấn đề|The city must [tackle] the issue of traffic.|catch,grab",
    "[weigh] up the options|cân nhắc các phương án|Take time to [weigh] up the options.|measure,count",
    "[serious] problem|vấn đề nghiêm trọng|Traffic is a [serious] problem in big cities.|heavy,thick",
    "[deal] with complaints|giải quyết khiếu nại|She [deals] with customer complaints.|do,play"
  ] },
  { id: "b2-opinion", level: "B2", icon: "💬", en: "Opinions & discussion", vi: "Bày tỏ quan điểm", items: [
    "[express] an opinion|bày tỏ quan điểm|Everyone can [express] an opinion.|say,speak",
    "[strongly] believe|tin chắc|I [strongly] believe this is wrong.|heavily,hardly",
    "[raise] a point|nêu ra một ý|You [raise] an interesting point.|rise,lift",
    "[reach] a conclusion|đi đến kết luận|We [reached] the same conclusion.|do,catch",
    "[make] a point|nêu luận điểm|She [made] a good point about costs.|do,say",
    "[hold] a view|giữ quan điểm|He [holds] the view that taxes are too high.|carry,grip",
    "[widely] accepted|được chấp nhận rộng rãi|This idea is now [widely] accepted.|wide,far",
    "[heated] debate|cuộc tranh luận nảy lửa|There was a [heated] debate about the plan.|hot,burning"
  ] },

  /* ============================== C1 ============================== */
  { id: "c1-academic", level: "C1", icon: "🔬", en: "Academic English", vi: "Tiếng Anh học thuật", items: [
    "[conduct] research|tiến hành nghiên cứu|The team [conducted] research on sleep.|make,drive",
    "[draw] a conclusion|rút ra kết luận|It is too early to [draw] a conclusion.|pull,take",
    "[shed] light on|làm sáng tỏ|The study [sheds] light on how memory works.|pour,give",
    "[empirical] evidence|bằng chứng thực nghiệm|There is little [empirical] evidence for this claim.|imperial,practise",
    "[play] a key role|đóng vai trò then chốt|Sleep [plays] a key role in learning.|do,make",
    "[address] the question|giải quyết vấn đề được đặt ra|This paper [addresses] the question of cost.|speak,tell",
    "[significant] increase|sự gia tăng đáng kể|There was a [significant] increase in sales.|important,signifying",
    "[bear] in mind|lưu ý, ghi nhớ|[Bear] in mind that the data are limited.|Hold,Carry|Cũng nói “keep in mind”."
  ] },
  { id: "c1-society", level: "C1", icon: "🏙️", en: "Society & policy", vi: "Xã hội & chính sách", items: [
    "[widen] the gap|nới rộng khoảng cách|Rising prices may [widen] the gap between rich and poor.|enlarge,stretch",
    "[implement] a policy|thực thi chính sách|The city plans to [implement] a new parking policy.|realise,perform",
    "[public] opinion|dư luận|[Public] opinion has changed.|People,Popular",
    "[vested] interest|lợi ích riêng (có quyền lợi gắn bó)|Some groups have a [vested] interest in the outcome.|dressed,invested",
    "[sweeping] changes|thay đổi sâu rộng|The law brought [sweeping] changes.|brushing,cleaning",
    "[meet] demand|đáp ứng nhu cầu|Factories are struggling to [meet] demand.|reach,catch",
    "[pressing] issue|vấn đề cấp bách|Housing is the most [pressing] issue for young people.|pushing,squeezing",
    "[take] into account|tính đến|We must [take] age into account.|put,bring"
  ] },
  { id: "c1-strategy", level: "C1", icon: "♟️", en: "Strategy & leadership", vi: "Chiến lược & lãnh đạo", items: [
    "[streamline] the process|tinh gọn quy trình|New software helped [streamline] the process.|stream,straighten",
    "[spearhead] a campaign|dẫn đầu chiến dịch|She [spearheaded] the campaign.|spear,headline",
    "[delegate] tasks|giao việc|A good manager knows how to [delegate] tasks.|send,deliver",
    "[foster] innovation|thúc đẩy đổi mới|We want to [foster] innovation in our team.|feed,breed",
    "[mitigate] risks|giảm thiểu rủi ro|Insurance helps [mitigate] risks.|militate,soften",
    "[long-term] goals|mục tiêu dài hạn|Focus on your [long-term] goals.|long-time,far-term",
    "[make] a concession|nhượng bộ|Both sides had to [make] concessions.|do,give",
    "[steep] learning curve|phải học rất nhiều trong thời gian ngắn|The new job has a [steep] learning curve.|high,tall"
  ] },
  { id: "c1-emotion", level: "C1", icon: "🎭", en: "Nuanced feelings", vi: "Sắc thái cảm xúc", items: [
    "[deeply] regret|vô cùng hối tiếc|I [deeply] regret what I said.|highly,heavily",
    "[utterly] exhausted|kiệt sức hoàn toàn|After the race I was [utterly] exhausted.|very,highly|Tính từ mạnh (exhausted, furious) đi với utterly/completely, không dùng “very” ✗.",
    "[mixed] feelings|cảm xúc lẫn lộn|I have [mixed] feelings about moving.|mixing,confused",
    "[overwhelming] support|sự ủng hộ áp đảo|The idea received [overwhelming] support.|overflowing,overweight",
    "[harbour] doubts|nuôi nghi ngờ trong lòng|Some still [harbour] doubts about the plan.|port,house",
    "[take] offence|phật lòng|Please don't [take] offence.|make,get",
    "[vivid] memories|ký ức sống động|I have [vivid] memories of my first race.|lively,alive",
    "[painfully] shy|nhút nhát vô cùng|As a child, he was [painfully] shy.|hurtfully,sorely"
  ] },
  { id: "c1-argument", level: "C1", icon: "⚖️", en: "Argument & debate", vi: "Lập luận & tranh biện", items: [
    "[put] forward an argument|đưa ra lập luận|She [put] forward a strong argument.|bring,give",
    "[compelling] evidence|bằng chứng thuyết phục|There is [compelling] evidence that exercise helps.|forcing,pushing",
    "[refute] a claim|bác bỏ một khẳng định|Scientists [refuted] the claim.|refuse,repel",
    "[beg] the question|đặt ra câu hỏi (buộc phải hỏi)|This [begs] the question: who will pay?|pray,plead",
    "[play] devil's advocate|cố tình phản biện|Let me [play] devil's advocate for a moment.|do,make",
    "[sound] argument|lập luận chặt chẽ|That's a [sound] argument.|noisy,heard",
    "[stand] up to scrutiny|đứng vững khi bị xem xét kỹ|The theory doesn't [stand] up to scrutiny.|sit,get|Cũng nói “hold up to scrutiny”.",
    "[concede] a point|thừa nhận một ý của đối phương|I'll [concede] the point, but costs still matter.|confess,succeed"
  ] }
];

/* Phân tích chuỗi → object (chạy được cả trên trình duyệt lẫn Node/vm) */
(function () {
  const list = window.COLLOCATIONS;
  list.forEach((t) => {
    t.items = t.items.map((row, i) => {
      if (typeof row !== "string") return row;
      const [c, vi, ex, wrong, note] = row.split("|");
      const m = c.match(/\[([^\]]+)\]/), mx = ex.match(/\[([^\]]+)\]/);
      return {
        id: `${t.id}-${i + 1}`,
        c,                                   // "[make] a decision"
        text: c.replace(/[[\]]/g, ""),       // "make a decision"
        key: m ? m[1] : "",                  // "make"
        vi, ex,
        exText: ex.replace(/[[\]]/g, ""),
        exKey: mx ? mx[1] : "",              // dạng trong câu, vd "made"
        // từ sai cùng kiểu chữ với từ được luyện (cụm luôn viết thường trừ danh từ riêng)
        wrong: (wrong || "").split(",").map((s) => s.trim()).filter(Boolean)
          .map((w) => (m && m[1][0] === m[1][0].toLowerCase() ? w[0].toLowerCase() + w.slice(1) : w)),
        note: note || ""
      };
    });
  });
})();
