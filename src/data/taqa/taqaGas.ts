import { parseRecords, ClientRecord } from './types';

const raw = `أبدوس إف إم سي جي للصناعة|Suez|Other Industries
أبناء عبد المنعم قتيلو لمنتجات الألبان والأغذية|Damietta|Food Industries
أبو علام للطوب الطفلى|Beni Suef|Brick Kilns
إبوس إيجيبت|Beni Suef|Other Industries
أتيكو فارما إيجيبت للأدوية|Suez|Pharmaceuticals
أجواء للصناعات الغذائية|Suez|Food Industries
أجواء للصناعات الغذائية - الأدبية|Suez|Food Industries
أدوية حكمة للصناعات الدوائية|Beni Suef|Pharmaceuticals
أرما للصناعات الغذائية|Suez|Food Industries
أزورا ايجيبت لتصنيع الأدوات الصحية|Suez|Other Industries
فليكس بي أي تي (إيجيبت) للصناعة|Beni Suef|Cement
فليكس بي أي تي (إيجيبت) للصناعة|Beni Suef|Cement
أفرو إنترناشيونال لإنتاج الأدوات الصحية|Beni Suef|Other Industries
أفكو مصر|Suez|Food Industries
أفكو مصر للزيوت - الأدبية|Suez|Food Industries
الأخوة لصناعة السيراميك والبورسلين|Suez|Ceramics & Porcelain
الإسراء للطوب الطفلي|Damietta|Brick Kilns
الأسكندرية للزيوت و الصابون|Kafr El Sheikh|Other Industries
الأمراء لإنتاج السيراميك - سيراميكا لابوتيه|Suez|Ceramics & Porcelain
الجبالى للصناعات الغذائية|Beni Suef|Food Industries
الجزيره لدرفلة الحديد|Beni Suef|Iron & Steel
الجوهرة لتصنيع المكرونة|Beni Suef|Food Industries
الحلال لصناعة الأعلاف|Beni Suef|Food Industries
الحمد جروب لتخزين الزيوت|Suez|Food Industries
الخليج للمشروعات والخدمات|Suez|Engineering Industries
الخمس نجوم للأعلاف والإنتاج الحيوانى|Suez|Food Industries
الدلتا للسكر|Kafr El Sheikh|Food Industries
الدمياطية للصناعات الغذائية|Damietta|Food Industries
الدورادو لصناعة السيراميك والادوات الصحيه|Suez|Ceramics & Porcelain
الدولية لصناعة السيراميك - سيراميكا روندى|Beni Suef|Ceramics & Porcelain
الدولية للصناعات الغذائية|Beni Suef|Food Industries
الدوليه لطحن وحرق كربونات الكالسيوم|Minya|Other Industries
الدوية للطوب الطفلى|Beni Suef|Brick Kilns
الدوينى للصناعة والتجاره|Suez|Other Industries
الذواقة للمخبوزات والحلويات|Beni Suef|Food Industries
الراعى لفرز وتجهيز وتجفيف وتعبئة حاصلات زراعية|Beni Suef|Food Industries
الروضة الشريفة لطحن وحرق الحجر الجيرى|Minya|Other Industries
الزعبلاوي باك للورق والكرتون|Suez|Other Industries
الزهراء لدرفلة الحديد|Beni Suef|Iron & Steel
السكر والصناعات التكاملية المصرية - سكر أبو قرقاص|Minya|Food Industries
السلمى لمجازر الدواجن الألية - دجدوجة|Beni Suef|Food Industries
السويدى الوطنية للصناعات والمشروعات الهندسية|Suez|Engineering Industries
السويدي للأسمنت|Suez|Cement
السويس العالمية للنترات - سينكو|Suez|Other Industries
السويس لتصنيع الأسمدة|Suez|Fertilizers
السويس للبوليستر|Suez|Other Industries
السويس للتعدين|Suez|Other Industries
السويس للصلب|Suez|Iron & Steel
السويس للصلب 2|Suez|Iron & Steel
السويس للصلب 3|Suez|Iron & Steel
السويس للصناعات الحديدية|Suez|Iron & Steel
السويس للصناعات الغذائية - سيوسكو|Suez|Food Industries
السويسرية للمواد العازلة|Suez|Other Industries
السويسريه للملابس القطنية|Beni Suef|Textile & Spinning
الشرق لصناعة السيراميك و البورسلين|Beni Suef|Ceramics & Porcelain
الشرقيون للبتروكيماويات|Suez|Petrochemicals
الشروق لتجفيف الخضروات|Beni Suef|Food Industries
الصعيد لصناعة المركزات والعصائر|Minya|Food Industries
الصعيد لصناعة المواد الغذائية|Beni Suef|Food Industries
العادلية للتجارة|Suez|Food Industries
العالمية لأنتاج الجوانتى|Minya|Other Industries
العالمية لتجارة وتصنيع مواد البناء|Suez|Other Industries
العالمية لصناعة الورق|Beni Suef|Other Industries
العالمية للصناعة - روك للسيراميك|Suez|Ceramics & Porcelain
العالمية لمهمات الحفر|Suez|Other Industries
العامة للبترول|Red Sea|Engineering Industries
العربى لصناعة الأجهزة الكهربائية والإلكترونية|Beni Suef|Engineering Industries
العربى لصناعة الأجهزة المنزلية|Beni Suef|Engineering Industries
العربية الخليجية لعصر وتكرير وتعبئة الزيوت النباتية|Suez|Food Industries
العربية لأنابيب البترول - سوميد|Suez|Other Industries
العربية لحفظ وتصنيع الحاصلات الزراعية|Minya|Food Industries
العربية لصناعة الصلب|Suez|Iron & Steel
العربية للأسمنت|Suez|Cement
العربية للزجاج الدوائى|Suez|Other Industries
العربية للزيوت ومشتقاتها|Suez|Other Industries
العز لصناعة الصلب المسطح|Suez|Iron & Steel
الفارس العربي|Suez|Food Industries
الفرنسيه لصناعة البورسلين|Beni Suef|Other Industries
الفكهانيه للاستيراد والتصدير|Beni Suef|Food Industries
الفنيه للصناعات المتخصصه|Beni Suef|Other Industries
الفنيه للكونتر|Damietta|Other Industries
الفهد للصناعات الغذائية|Suez|Food Industries
الفيومى لبسكويت الايس كريم|Damietta|Food Industries
القاهرة للزيوت والصابون|Suez|Food Industries
القناة للسكر|Minya|Food Industries
الكرمة للأعلاف الحيوانيه والداجنه|Beni Suef|Food Industries
الكرنك للاستيراد والتصدير|Suez|Other Industries
الماسه لاعادة تدوير الورق وتصنيعه|Beni Suef|Other Industries
المالية والصناعية المصرية - أسيوط للأسمدة|Asyut|Fertilizers
المالية والصناعية المصرية - العين السخنة للأسمدة|Suez|Fertilizers
المتحدة لتجفيف الحاصلات الزراعية|Minya|Food Industries
المتحدة لتصنيع الزيوت والعبوات|Suez|Food Industries
المتحدة للصناعات الغذائية|Beni Suef|Food Industries
المحبة لتجفيف النباتات العطرية|Beni Suef|Food Industries
المدينة لصناعة الجبس|Suez|Other Industries
المركز الاسلامي للتجارة والتصنيع|Damietta|Food Industries
المصرية الألمانية للصناعات الانشائية|Beni Suef|Other Industries
المصرية الصينية|Suez|Food Industries
المصرية الصينية لألواح الألومنيوم|Suez|Aluminum
المصرية الصينية للبلاستيك والألياف الصناعية|Suez|Other Industries
المصرية الصينية للرمال السوداء|Kafr El Sheikh|Other Industries
المصرية الفرنسية للصناعات الغذائية|Beni Suef|Food Industries
المصرية المتحدة للسكر|Suez|Food Industries
المصرية الهولندية لصناعة وتجارة الألومنيوم|Beni Suef|Aluminum
المصرية لبلوكات الأنود الكربونية|Suez|Other Industries
المصرية للأسمدة 1|Suez|Fertilizers
المصرية للأسمدة 2|Suez|Fertilizers
المصرية للرمال السوداء|Kafr El Sheikh|Other Industries
المصرية للصناعات الأساسية - إيبك|Suez|Fertilizers
المصرية للمنتجات الحديدية والمجلفنة|Suez|Engineering Industries
المصرية للهيدروكربون|Suez|Fertilizers
المصرية لمنتجات الحديد والصلب|Suez|Iron & Steel
الملكة للحلاوة الطحينية والطحينة|Minya|Food Industries
المنيا فودز لصناعة الحلاوه الطحينيه والطحينه|Minya|Food Industries
النجمة الذهبية|Beni Suef|Other Industries
الندى للصناعات الغذائية|Damietta|Food Industries
الندى للصناعات الغذائية 2|Damietta|Food Industries
النصر لتصنيع الحاصلات الزراعية|Beni Suef|Food Industries
النصر للكيماويات الوسيطة|Suez|Fertilizers
النصر للكيماويات الوسيطة 2|Suez|Fertilizers
النقيطى للعطارة والزيوت|Damietta|Food Industries
الهايدى لتصنيع المكرونة|Beni Suef|Food Industries
الهلب للمبيدات والكيماويات|Damietta|Other Industries
الهندسية لصناعة الورق|Beni Suef|Other Industries
الوادى للصناعات الغذائية|Minya|Food Industries
الوجة القبلى الوطنية للطوب الطفلي|Beni Suef|Brick Kilns
أليكو إيجيبت|Suez|Glass
أمارينا أبو سوما ريزورت|Red Sea|Hotels
أنترناشيونال لصناعة الورق|Beni Suef|Other Industries
أنجل ييست إيجيبت|Beni Suef|Food Industries
انداجرو للصناعات الغذائية والزراعية|Beni Suef|Food Industries
اورجنك لايف للصناعات الغذائية|Beni Suef|Food Industries
أولاد العدوى لصناعة الورق|Minya|Other Industries
أى .فى .ال دنسرى بولى استر|Suez|Petrochemicals
أى أى سى لإدارة مصانع الصلب - حديد المصريين|Beni Suef|Iron & Steel
إيجيبت فان يانغ للمنسوجات|Suez|Textile & Spinning
إيجيبت كادي للمنسوجات|Suez|Textile & Spinning
ايديتا لصناعة الحلويات|Beni Suef|Food Industries
ايكو كرافت للصناعات الخشبية|Damietta|Other Industries
إيكوبات للتنمية الصناعية|Suez|Other Industries
إيل هوا إيجيبت للمنسوجات|Beni Suef|Textile & Spinning
إيماك لتصنيع الورق|Suez|Other Industries
إيمسيا دينيم لصناعة الألبسة الجاهزة|Beni Suef|Textile & Spinning
إيه دبليو بى E W B|Damietta|Engineering Industries
باستا فودز مصر|Beni Suef|Food Industries
بالم تريد لتصنيع الزيوت|Suez|Food Industries
بلانت فوم للإسفنج والمفروشات المتنوعة|Beni Suef|Other Industries
بلو سبا ريزورت|Red Sea|Hotels
بليزا للأدوات الصحية|Damietta|Other Industries
بنى سويف الجديدة لحفظ وتجفيف الخضراوات|Beni Suef|Food Industries
بنى سويف لتصنيع خام الكرتون|Beni Suef|Other Industries
بنى سويف للأستثمارات الزراعية والتجارية|Beni Suef|Other Industries
بنى سويف للصناعات الغذائية|Beni Suef|Food Industries
بورسعيد الوطنية للصلب - حديد المصريين|Suez|Iron & Steel
بورسلينا للأدوات الصحية|Damietta|Other Industries
بى بى أر لتدوير عبوات البولى أستر|Suez|Other Industries
تراست للتجارة والصناعة|Damietta|Food Industries
توب تاتش للصناعات المغذية|Beni Suef|Engineering Industries
توب تك لتصنيع وتجميع الأجهزة والأدوات الكهربائية|Damietta|Engineering Industries
جاز كازا دل مار أوتيل|Red Sea|Hotels
جاز كازا دل مار ريزورت|Red Sea|Hotels
جاز مكادى اوازيس ريزورت|Red Sea|Hotels
جالاكسى للكيماويات (مصر)|Suez|Other Industries
جراند لتصنيع أعلاف الأسماك|Damietta|Food Industries
جلوبال فارما للتصنيع وتجارة الأدوية|Beni Suef|Pharmaceuticals
جنوب الوادي للأسمنت|Beni Suef|Cement
جوشى مصر لصناعة الفايبر جلاس|Suez|Other Industries
جى بى للحافلات|Suez|Engineering Industries
حسان عيد مصطفى اسماعيل|Beni Suef|Food Industries
حلايب لمنتجات الالبان والعصائر|Damietta|Food Industries
حورس ادفو للصناعات التكميليه والتحويليه للورق|Beni Suef|Other Industries
حورس للمكرونة|Minya|Food Industries
خير بلدنا للصناعات الغذائية|Minya|Food Industries
دايون إيجيبت موتور|Suez|Engineering Industries
دلتا تكستايل شمال الصعيد للملابس الجاهزة|Minya|Textile & Spinning
دمياط للدواجن|Damietta|Food Industries
دمياط للزيوت|Damietta|Food Industries
دمياط للغزل والنسيج|Damietta|Textile & Spinning
دهب سيناء للتصنيع ومواد البناء|Suez|Other Industries
دهب للطوب الطفلى|Damietta|Brick Kilns
دهيدرو فودز|Beni Suef|Food Industries
دى يو (مصر) لطباعة وصباغة المنسوجات|Suez|Textile & Spinning
رويال للزيوت - يونى كيما|Suez|Food Industries
رويال هيربس لصناعة النباتات الطبية والعطرية|Beni Suef|Food Industries
ريلوبز للحلول البيئية|Suez|Other Industries
ريو فودز للصناعات الغذائية|Beni Suef|Food Industries
سامسونج الكترونيكس مصر|Beni Suef|Engineering Industries
سان جوبان مصر للزجاج|Suez|Glass
ستار إيجيبت للمطاحن|Minya|Food Industries
سكور جراس للصناعة والإستثمار|Suez|Other Industries
سنتر فيد إنترناشيونال|Beni Suef|Food Industries
سونكر لتموين السفن|Suez|Other Industries
سيراميكا فانسي|Suez|Ceramics & Porcelain
سيراميكا فيردى وأوسكار وأوليمبيك|Suez|Ceramics & Porcelain
سيراميكيا حورس لصناعة الأدوات الصحية|Beni Suef|Other Industries
سيريل لإنتاج البورسلين والسيراميك والأدوات الصحية|Suez|Ceramics & Porcelain
سيناى ميديكال سابلايز للمنتجات المطاطية|Suez|Pharmaceuticals
شامى الأصلى للصناعات الغذائية - البسيونى|Damietta|Food Industries
شين شينغ لصناعة أنابيب حديد الدكتايل|Suez|Other Industries
صافولا مصر - الأدبية|Suez|Food Industries
صافولا مصر 1|Suez|Food Industries
صافولا مصر 2|Suez|Food Industries
صردكس لتصنيع الحلويات|Kafr El Sheikh|Food Industries
صناعات الزيوت المتكاملة|Suez|Food Industries
Dummy|Beni Suef|Food Industries
طيبة للصناعات الغذائية|Beni Suef|Food Industries
عامر للتبريد والصناعات الغذائية|Damietta|Food Industries
عتاقة للجبس|Suez|Other Industries
عسل للاثاث نصر حسين محمد مصطفى عسل وشريكيه|Damietta|Engineering Industries
على عبد الرحمن مصطفى أحمد|Beni Suef|Food Industries
فانوارد للأجهزة المنزلية المحدودة|Suez|Engineering Industries
فليكس بي أي تي (إيجيبت) للصناعة|Suez|Other Industries
فندق أخناتون بيلا فيستا|Red Sea|Hotels
فندق أكوا جوى باى صن رايز|Red Sea|Hotels
فندق أكوا فيستا|Red Sea|Hotels
فندق الباتروس سيتادل|Red Sea|Hotels
فندق البارون بالاس|Red Sea|Hotels
فندق الفيو|Red Sea|Hotels
فندق الماريوت|Red Sea|Hotels
فندق امباير ثرى كورنرز|Red Sea|Hotels
فندق أى أم سى رويال|Red Sea|Hotels
فندق إيفل|Red Sea|Hotels
فندق باردايس سهل حشيش|Red Sea|Hotels
فندق بالم بيتش|Red Sea|Hotels
فندق بانوراما بانجولوز|Red Sea|Hotels
فندق بركيريز سوما باى|Red Sea|Hotels
فندق بريما لايف مكادى|Red Sea|Hotels
فندق بريميير لو ريف سهل حشيش|Red Sea|Hotels
فندق بل اير أزور|Red Sea|Hotels
فندق بلو لاجون|Red Sea|Hotels
فندق بيتش كلوب|Red Sea|Hotels
فندق بيراميزا سهل حشيش|Red Sea|Hotels
فندق بيروت|Red Sea|Hotels
فندق تان اوك - العين السخنة|Suez|Hotels
فندق تروبيتل سهل حشيش|Red Sea|Hotels
فندق توليب الجلالة الساحلى|Suez|Hotels
فندق تيا هايتس & زانادو مكادى|Red Sea|Hotels
فندق تيتانيك رويال|Red Sea|Hotels
فندق تيوليب ريزورت 6|Suez|Hotels
فندق جاز أكوا فيفا|Red Sea|Hotels
فندق جاز مكادى جاردينز|Red Sea|Hotels
فندق جاز مكادى ستار أند سبا|Red Sea|Hotels
فندق جاز مكادى سرايا|Red Sea|Hotels
فندق جاز مكادى سرايا بالمز|Red Sea|Hotels
فندق جراند أوتيل|Red Sea|Hotels
فندق جراند بالاس|Red Sea|Hotels
فندق جراند سيز ريزورت|Red Sea|Hotels
فندق جراند سيفا|Red Sea|Hotels
فندق جراند مكادى|Red Sea|Hotels
فندق جولدن بيتش|Red Sea|Hotels
فندق جولدن فايف|Red Sea|Hotels
فندق ربنسون سوما باى|Red Sea|Hotels
فندق روما|Red Sea|Hotels
فندق رويال ستار امباير|Red Sea|Hotels
فندق سندباد أكوا أوتيل|Red Sea|Hotels
فندق سندباد أكوا ريزورت|Red Sea|Hotels
فندق سندباد بيتش|Red Sea|Hotels
فندق سوليمار سوما بيتش كلوب|Red Sea|Hotels
فندق سويس ان الغردقة|Red Sea|Hotels
فندق سى جل ريزورت|Red Sea|Hotels
فندق سى جل كلوب|Red Sea|Hotels
فندق سى ستار بوريفاج|Red Sea|Hotels
فندق سى لايف|Red Sea|Hotels
فندق سى ورلد - اكوا بلو|Red Sea|Hotels
فندق سيرنتى سهل حشيش|Red Sea|Hotels
فندق سيرينتى مكادى|Red Sea|Hotels
فندق سيزر بالاس|Red Sea|Hotels
فندق شتايجنبرجر الداو بيتش|Red Sea|Hotels
فندق شتايجنبرجر الداو كلوب|Red Sea|Hotels
فندق شتايجنبرجر رأس سوما|Red Sea|Hotels
فندق شتايجينبرجر مكادى|Red Sea|Hotels
فندق شرم الناقة أبو سومه|Red Sea|Hotels
فندق شمس سفاجا|Red Sea|Hotels
فندق شيراتون سوما باى|Red Sea|Hotels
فندق صحارا|Red Sea|Hotels
فندق صن رايز كريستال باى|Red Sea|Hotels
فندق صن رايز هوليدايز|Red Sea|Hotels
فندق صنى بيتش|Red Sea|Hotels
فندق صنى دايز بالما دى ميريت|Red Sea|Hotels
فندق صنى دايز ميريت|Red Sea|Hotels
فندق عربيلا أزور|Red Sea|Hotels
فندق عربيه أزور|Red Sea|Hotels
فندق فستيفل شدوان جولدن|Red Sea|Hotels
فندق كاريبيان ورلد سوما باى|Red Sea|Hotels
فندق كاسكيد سوما باى|Red Sea|Hotels
فندق كليوباترا مكادى|Red Sea|Hotels
فندق كمبنسكى سوما باى|Red Sea|Hotels
فندق كورال بيتش|Red Sea|Hotels
فندق كونتيننتال الغردقة|Red Sea|Hotels
فندق كينج توت|Red Sea|Hotels
فندق لابرندا رويال مكادى|Red Sea|Hotels
فندق لونج بيتش|Red Sea|Hotels
فندق ماجيك ورلد سيرينا بيتش|Red Sea|Hotels
فندق مارلين إن|Red Sea|Hotels
فندق ممنون سفاجا|Red Sea|Hotels
فندق منتجع جراند|Red Sea|Hotels
فندق موفنبيك - العين السخنة|Suez|Hotels
فندق ميركور|Red Sea|Hotels
فندق هارمونى مكادى باى|Red Sea|Hotels
فندق هاواى بارادايس|Red Sea|Hotels
فندق هاواى جبل الحريم - سفنكس|Red Sea|Hotels
فندق هاواى ريفييرا أكو بارك|Red Sea|Hotels
فندق هاواى لو جاردن|Red Sea|Hotels
فندق هيلتون بلازا|Red Sea|Hotels
فندق وايت بيتش|Red Sea|Hotels
فندق ومنتجع سونستا فرعون|Red Sea|Hotels
فيدمكس إيجيبت لصناعة الأعلاف|Beni Suef|Food Industries
فيلوباكينج للتصنيع|Beni Suef|Other Industries
فيمس فود للصناعات الغذائية|Damietta|Food Industries
فينافيل مصر للكيماويات|Suez|Other Industries
قرية أروما ريزيدنس - العين السخنة|Suez|Hotels
قرية الباتروس بالاس|Red Sea|Hotels
قرية الباتروس جاردن|Red Sea|Hotels
قرية الباشا|Red Sea|Hotels
قرية البستان - العين السخنة|Suez|Hotels
قرية الجفتون|Red Sea|Hotels
قرية الجيسوم السياحية|Red Sea|Hotels
قرية العين بـــاى - العين السخنة|Suez|Hotels
قرية الف ليلة وليله|Red Sea|Hotels
قرية الياسمين بالاس ريزورت|Red Sea|Hotels
قرية الياسمين بيتش|Red Sea|Hotels
قرية بيتش الباتروس|Red Sea|Hotels
قرية تايتنيك أكوا|Red Sea|Hotels
قرية تيتانك بيتش|Red Sea|Hotels
قرية جاردن بيتش|Red Sea|Hotels
قرية جانجل اكوا بارك|Red Sea|Hotels
قرية دانا بيتش|Red Sea|Hotels
قرية ذهبية|Red Sea|Hotels
قرية ساند بيتش|Red Sea|Hotels
قرية صنى دايز البلاسيو|Red Sea|Hotels
قرية علاء الدين|Red Sea|Hotels
قرية على بابا|Red Sea|Hotels
قرية فورت أرابيسك بلو بيتش|Red Sea|Hotels
قرية للى لاند|Red Sea|Hotels
قرية ماجيك بيتش|Red Sea|Hotels
قرية مملوك بالاس|Red Sea|Hotels
قرية مينا مارك|Red Sea|Hotels
قرية نسمة أمل|Red Sea|Hotels
قرية نوبيا|Red Sea|Hotels
قرية وردة الصحراء|Red Sea|Hotels
قلعة الكرتون لإنتاج وتصنيع الكرتون والورق|Damietta|Other Industries
قمينة طوب الوليد غنيم|Kafr El Sheikh|Brick Kilns
قمينة طوب جامع اللقاني|Kafr El Sheikh|Brick Kilns
قمينة طوب خالد هندى|Damietta|Brick Kilns
قمينة طوب سيد أحمد|Kafr El Sheikh|Brick Kilns
قمينة طوب علاء كدش - النصر|Damietta|Brick Kilns
قمينة طوب فتحي الشامي|Kafr El Sheikh|Brick Kilns
قمينة طوب كمال الصديق|Damietta|Brick Kilns
قمينة طوب محمود غنيم|Kafr El Sheikh|Brick Kilns
قمينة طوب يونس الشيخ|Damietta|Brick Kilns
كاراس لصناعة السيراميك والبورسلين|Suez|Ceramics & Porcelain
كاردوميد للصناعات الطبية|Beni Suef|Other Industries
كرمان للصناعات الدوائية|Beni Suef|Pharmaceuticals
كليوباترا للأسمنت - كليوباترا جالاريا|Suez|Ceramics & Porcelain
كناوف ايجيبت الى بى|Suez|Other Industries
كور للمحركات الكهربية|Beni Suef|Engineering Industries
كيان للمنتجات الأسمنتية والجبسية|Suez|Other Industries
لافارج للأسمنت مصر|Suez|Cement
لوتس ابر ايجيبت للمنتجات الحيوية|Minya|Food Industries
لى تشو ايجيبت للنسيج والطباعة والصباغة|Suez|Textile & Spinning
لينتو لصناعة السيراميك|Beni Suef|Ceramics & Porcelain
مالتى ستورز|Suez|Food Industries
مايوركا للاستثمار السياحي وصناعة السيراميك|Beni Suef|Ceramics & Porcelain
مجدى صبرى إسماعيل شوشه|Beni Suef|Other Industries
محطة كهرباء السويس الحرارية|Suez|Electricity
محطة كهرباء جنوب الغردقة الغازية|Red Sea|Electricity
محطة كهرباء خليج السويس|Suez|Electricity
محطة كهرباء رأس غارب|Red Sea|Electricity
محطة كهرباء غرب أسيوط المركبة|Asyut|Electricity
محمد السيد عبد العزيز سالم|Damietta|Brick Kilns
محمد محمد عبد الحليم عسل - الدمياطى|Damietta|Food Industries
مصر العالمية للسليكات|Suez|Other Industries
مصر الوطنية للصلب - عتاقة|Suez|Iron & Steel
مصر إيران للغزل والنسيج - ميراتكس|Suez|Textile & Spinning
مصر ايطاليا للمركزات والعصائر|Damietta|Food Industries
مصر ايطاليا للمكرونة والصناعات الغذائية|Damietta|Food Industries
مصر بني سويف للأسمنت|Beni Suef|Cement
مصطفى عبد العظيم إبراهيم عبد العظيم|Beni Suef|Food Industries
مصنع السلمى للمكرونة|Minya|Food Industries
مصنع الفهد للأعلاف|Beni Suef|Food Industries
مصنع اللوتس لصناعة الورق|Beni Suef|Other Industries
مصنع إنتاج ألواح الكوارتز|Suez|Other Industries
مطاحن الفطام|Beni Suef|Food Industries
مكة لصناعة الأعلاف|Beni Suef|Food Industries
مكة للكرتون والصناعات الورقية|Beni Suef|Other Industries
مكه لتجفيف الخضراوات|Beni Suef|Food Industries
منتجع بالم رويال سوما باي|Red Sea|Hotels
منتجع جراند - مبنى سكن العاملين|Red Sea|Hotels
منتجع سمرا باى|Red Sea|Hotels
منتجع كايسول رومانسي|Red Sea|Hotels
منتجع موفنبيك سوما باى|Red Sea|Hotels
ميدفيرت مصر للأستثمار|Suez|Fertilizers
ميدو لأنتاج مركزات العصائر والصلصة|Minya|Food Industries
ميديا ايجيبت لأجهزة المطابخ وسخانات المياه|Suez|Engineering Industries
ميديترانيو للصناعة|Damietta|Food Industries
ميلامين وود|Damietta|Other Industries
نايل بيبر لصناعه الورق|Beni Suef|Other Industries
نايل فايبر لإنتاج ألياف البوليستر|Suez|Other Industries
نفيدكو - ناشيونال للأستثمار الصناعى والتنمية|Minya|Food Industries
نور نايل تكستايلز|Beni Suef|Engineering Industries
نوريل مصر|Suez|Pharmaceuticals
نوريل مصر - الأدبية|Suez|Food Industries
نيو هوب إيجيبت الزراعية المحدودة|Beni Suef|Food Industries
هارد للصناعات الكيماوية (الغراء ومواد اللصق)|Damietta|Other Industries
هاى فيد لتصنيع الأعلاف والإستثمار الداجنى والحيوانى|Beni Suef|Food Industries
هليوبوليس لمواد البناء جبس الفيروز سيناء|Suez|Other Industries
هيات إيجيبت للمنتجات الصحية|Suez|Other Industries
هيات إيجيبت للمنتجات الصحية - محطة توليد كهرباء|Suez|Power Stations
هيلثى فودز إيجبت|Beni Suef|Food Industries
وادى النيل للأعلاف|Asyut|Food Industries
وايت أند بلاك|Suez|Textile & Spinning
وود ورلد|Damietta|Engineering Industries
ياردكس للنجيل الصناعى|Suez|Other Industries
يونكسا إيجيبت للفريت والجليز|Suez|Other Industries
كارجاس الفردوس رأس غارب - البحر الأحمر|Red Sea|Vehicle Fueling
غازتك ميدان الدهار الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
غازتك ميدان جهينة الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
غازتك طريق المطار الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
غازتك الكرنك الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
غازتك ميدان سينزو الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
غازتك منطقة النجدة الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
كارجاس منطقة النجدة الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
كارجاس الغردقة القديمة - البحر الأحمر|Red Sea|Vehicle Fueling
ماستر جاس الحجاز 1 الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
ماستر جاس الحجاز 2 الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
ماستر جاس طريق المطار الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
غازتك رأس غارب - البحر الأحمر|Red Sea|Vehicle Fueling
ماستر جاس الزعفرانه رأس غارب - البحر الأحمر|Red Sea|Vehicle Fueling
كارجاس شيرتوان مبارك 2 الغردقة - البحر الأحمر|Red Sea|Vehicle Fueling
المصرية للأنشاءات الصينية المحدودة للهياكل الفولاذية|Suez|Other Industries
شين جين للمنتجات النسيجية والطباعة والصباغة المحدودة|Suez|Textile & Spinning
يوران رون لطباعة وصباغة المنسوجات المحدودة|Suez|Textile & Spinning
غازتك الأدبية - السويس|Suez|Vehicle Fueling
كارجاس الادبية - السويس|Suez|Vehicle Fueling
فيوتشرفيرت لصناعة الأسمدة والكيماويات|Suez|Fertilizers
غازتك فيصل - السويس|Suez|Vehicle Fueling
غازتك شارع الجيش - السويس|Suez|Vehicle Fueling
غازتك الجلاء - السويس|Suez|Vehicle Fueling
غازتك التوفيقية - السويس|Suez|Vehicle Fueling
غازتك ورش المحافظة - السويس|Suez|Vehicle Fueling
غازتك معسكر قوات الأمن - السويس|Suez|Vehicle Fueling
غازتك صلاح نسيم - السويس|Suez|Vehicle Fueling
كارجاس طريق ناصر - السويس|Suez|Vehicle Fueling
كارجاس المدرسة العسكرية - السويس|Suez|Vehicle Fueling
كارجاس أبو عارف الجناين - السويس|Suez|Vehicle Fueling
كارجاس صلاح نسيم - السويس|Suez|Vehicle Fueling
كارجاس السلام 2 - السويس|Suez|Vehicle Fueling
ماستر جاس الموقف 1 السلام - السويس|Suez|Vehicle Fueling
ماستر جاس الموقف 2 السلام - السويس|Suez|Vehicle Fueling
ماستر جاس العين السخنة - السويس|Suez|Vehicle Fueling
توتال صلاح نسيم - السويس|Suez|Vehicle Fueling
الدولية للكيماويات|Suez|Other Industries
دريم للتجارة والصناعة|Suez|Other Industries
المنار لصناعة الكرتون|Suez|Other Industries
ايجيبشن فايبر جلاس|Suez|Other Industries
الدولية للتجارة والتعدين والتوكيلات التجارية|Suez|Other Industries
بي شين تاي شان المصرية لتكنولوجيا مواد البناء|Suez|Other Industries
المينا بلاست|Suez|Other Industries
كمت للصناعات التكاملية|Suez|Other Industries
المصرية تراست للصناعات النسيجية|Suez|Textile & Spinning
جلوبال للطاقة|Suez|Power Stations
أسكوم لتصنيع الكربونات والكيماويات|Minya|Other Industries
غازتك جورج مغاغا - المنيا|Minya|Vehicle Fueling
غازتك صفصافه - المنيا|Minya|Vehicle Fueling
غازتك سكه تله - المنيا|Minya|Vehicle Fueling
كارجاس تقسيم شلبى - المنيا|Minya|Vehicle Fueling
كارجاس ماقوسة - المنيا|Minya|Vehicle Fueling
كارجاس بني أحمد - المنيا|Minya|Vehicle Fueling
ماستر جاس ماقوسة 1 - المنيا|Minya|Vehicle Fueling
ماستر جاس ماقوسة 2 - المنيا|Minya|Vehicle Fueling
كارجاس الحى الخامس المنيا الجديدة - المنيا|Minya|Vehicle Fueling
غازتك القطشه سمالوط مطاى - المنيا|Minya|Vehicle Fueling
غازتك أبوالوفا سمالوط مطاى - المنيا|Minya|Vehicle Fueling
غازتك الشريعى سمالوط مطاى - المنيا|Minya|Vehicle Fueling
غازتك شوشة سمالوط مطاى - المنيا|Minya|Vehicle Fueling
غازتك عفت مطاى - المنيا|Minya|Vehicle Fueling
غازتك الشريف ملوى - المنيا|Minya|Vehicle Fueling
كارجاس الطريق الزراعى ملوى - المنيا|Minya|Vehicle Fueling
كارجاس الأشمونين ملوى - المنيا|Minya|Vehicle Fueling
المصرية اليونانية للطوب الطفلى والقرميد|Minya|Brick Kilns
مصنع ترنتى لتجفيف الحاصلات الزراعية|Minya|Food Industries
ماستر جاس الخارجة 1 - الوادى الجديد|New Valley|Vehicle Fueling
ماستر جاس الخارجة 2 - الوادى الجديد|New Valley|Vehicle Fueling
تنمية الصناعات الكيماوية - سيد|Asyut|Pharmaceuticals
كارجاس أبو كُريم ديروط - أسيوط|Asyut|Vehicle Fueling
غازتك أبو تيج - أسيوط|Asyut|Vehicle Fueling
كارجاس أبو تيج - أسيوط|Asyut|Vehicle Fueling
غازتك حى غرب - أسيوط|Asyut|Vehicle Fueling
غازتك الواسطى الفتح - أسيوط|Asyut|Vehicle Fueling
غازتك عرب المدابغ - أسيوط|Asyut|Vehicle Fueling
غازتك جراج شركة الصعيد - أسيوط|Asyut|Vehicle Fueling
كارجاس أبنوب - أسيوط|Asyut|Vehicle Fueling
ماستر جاس عرب المدابغ - أسيوط|Asyut|Vehicle Fueling
ماستر جاس القناطر - أسيوط|Asyut|Vehicle Fueling
ماستر جاس القناطر 2 - أسيوط|Asyut|Vehicle Fueling
غازتك دشلوط ديروط - أسيوط|Asyut|Vehicle Fueling
كارجاس الصحراوى الغربى دشلوط - أسيوط|Asyut|Vehicle Fueling
أسيوط الوطنية لتصنيع البترول - أنوبك|Asyut|Other Industries
جنرال مديترنيان لصناعة الورق|Beni Suef|Other Industries
أحمد محمد عوض الله طلبة|Beni Suef|Iron & Steel
بنى سويف للعزل الحرارى ومواد التعبئة|Beni Suef|Other Industries
ريد مكس للخراسانات الجاهزة وإنتاج الجبس|Beni Suef|Other Industries
الرحمن للطوب الطفلي|Beni Suef|Brick Kilns
الوطنية للصناعات المعدنية|Beni Suef|Engineering Industries
الوطنية لصناعة الأجهزة المنزلية|Beni Suef|Engineering Industries
بلانتفورم للصناعات الغذائية|Beni Suef|Food Industries
الديب لدرفلة الحديد|Beni Suef|Iron & Steel
غازتك عبدالله الفشن - بنى سويف|Beni Suef|Vehicle Fueling
غازتك الشيخ عابد سمسطا الفشن - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس الفشن القديمة - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس الساحة سمسطا الفشن - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس الفشن الجديدة - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس ببا الفشن - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس الشنطور سمسطا الفشن - بنى سويف|Beni Suef|Vehicle Fueling
ماستر جاس ببا الفشن - بنى سويف|Beni Suef|Vehicle Fueling
ماستر جاس مغاغا الفشن - بنى سويف|Beni Suef|Vehicle Fueling
غازتك مبروك الواسطى - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس كوبرى المغاربة الواسطى - بنى سويف|Beni Suef|Vehicle Fueling
غازتك النهضة - بنى سويف|Beni Suef|Vehicle Fueling
غازتك تزمنت - بنى سويف|Beni Suef|Vehicle Fueling
غازتك المرور - بنى سويف|Beni Suef|Vehicle Fueling
غازتك النقد شحاته - بنى سويف|Beni Suef|Vehicle Fueling
غازتك الجراج - بنى سويف|Beni Suef|Vehicle Fueling
غازتك إهناسيا - بنى سويف|Beni Suef|Vehicle Fueling
غازتك العلالمة - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس كوبرى السادات - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس الجراج - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس بنى سويف الجديدة - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس مدينة بوش - بنى سويف|Beni Suef|Vehicle Fueling
كارجاس زهراء بياض العرب - بنى سويف|Beni Suef|Vehicle Fueling
ماستر جاس التعاون - بنى سويف|Beni Suef|Vehicle Fueling
ماستر جاس التعاون 2 طريق دمو - بنى سويف|Beni Suef|Vehicle Fueling
مصنع الشيخ للطوب الطفلى|Beni Suef|Brick Kilns
المصرية للإيثانول الحيوي|Damietta|Petrochemicals
السويس لمشتقات الميثانول|Damietta|Petrochemicals
فرست وود|Damietta|Engineering Industries
غازتك كفر سعد دمياط الجديدة - دمياط|Damietta|Vehicle Fueling
كارجاس الوسطانى دمياط الجديدة - دمياط|Damietta|Vehicle Fueling
غازتك ميدان الجامع دمياط الجديدة - دمياط|Damietta|Vehicle Fueling
غازتك فارسكور دمياط الجديدة - دمياط|Damietta|Vehicle Fueling
غازتك عزبة البرج دمياط القديمة - دمياط|Damietta|Vehicle Fueling
كارجاس المنطقة الصناعية دمياط الجديدة - دمياط|Damietta|Vehicle Fueling
كارجاس كفر سعد دمياط الجديدة - دمياط|Damietta|Vehicle Fueling
كارجاس النشار دمياط القديمة - دمياط|Damietta|Vehicle Fueling
العالمية للأسلاك MEM|Damietta|Other Industries
أدفينا للأغذية المحفوظة|Damietta|Food Industries
كارجاس التعاون بيلا - كفر الشيخ|Kafr El Sheikh|Vehicle Fueling
ماستر جاس أول طريق دسوق - كفر الشيخ|Kafr El Sheikh|Vehicle Fueling
غازتك القفاص دسوق - كفر الشيخ|Kafr El Sheikh|Vehicle Fueling
غازتك أبو السعد فوه - كفر الشيخ|Kafr El Sheikh|Vehicle Fueling
ماستر جاس طريق أبو عمر - كفر الشيخ|Kafr El Sheikh|Vehicle Fueling
ماستر جاس طريق الحامول - كفر الشيخ|Kafr El Sheikh|Vehicle Fueling
ماستر جاس شيل أوت 3 - كفر الشيخ|Kafr El Sheikh|Vehicle Fueling
قمينة طوب يحي زعلوك|Kafr El Sheikh|Brick Kilns
سيميتار إيجيبت للإنتاج المحدودة|Red Sea|Engineering Industries
فندق أوبروى|Red Sea|Hotels
فندق توليب الجلالة الجبلى|Suez|Hotels
فندق جاز أكوا مارينا ريزورت|Red Sea|Hotels
قرية ريكسوس مجاويش|Red Sea|Hotels`;

export const taqaGasData: ClientRecord[] = parseRecords(raw, "Gas Distribution").map(r => ({
  ...r,
  activity: r.activity === "Vehicle Fueling" ? "CNG Station Connected" : r.activity,
}));
