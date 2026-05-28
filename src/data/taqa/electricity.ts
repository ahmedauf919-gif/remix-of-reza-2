import { parseRecords, ClientRecord } from './types';

const raw = `طنبو فوود انجريدينتس للتصنيع الغذائى والزراعى|Medium Voltage Electricity Distribution|Giza|Food Industries
ريكسوس سي جيت سى فيو|Medium Voltage Electricity Distribution|South Sinai|Hotels
ريكسوس سي جيت (سكن العاملين)|Medium Voltage Electricity Distribution|South Sinai|Hotels
ريكسوس سي جيت 2 (الفناء الخلفي)|Medium Voltage Electricity Distribution|South Sinai|Hotels
سي كلوب شرم ليون|Medium Voltage Electricity Distribution|South Sinai|Hotels
لايف شرم ليون|Medium Voltage Electricity Distribution|South Sinai|Hotels
سي جاردن|Medium Voltage Electricity Distribution|South Sinai|Hotels
ماجيك وورلد|Medium Voltage Electricity Distribution|South Sinai|Hotels
لاجونا فيستا|Medium Voltage Electricity Distribution|South Sinai|Hotels
هورايزون|Medium Voltage Electricity Distribution|South Sinai|Hotels
بالميرا|Medium Voltage Electricity Distribution|South Sinai|Hotels
قمر الزمان|Medium Voltage Electricity Distribution|South Sinai|Hotels
زوارة|Medium Voltage Electricity Distribution|South Sinai|Hotels
راداميس 2|Medium Voltage Electricity Distribution|South Sinai|Hotels
راداميس (الفناء الخلفي)|Medium Voltage Electricity Distribution|South Sinai|Hotels
البطروس|Medium Voltage Electricity Distribution|South Sinai|Hotels
لاجونا دايفينج|Medium Voltage Electricity Distribution|South Sinai|Hotels
IU محطة مياه المركزية|Medium Voltage Electricity Distribution|South Sinai|Water Plant
محطة مياه دايموند الذهبية|Medium Voltage Electricity Distribution|South Sinai|Water Plant
نبق سنترال|Medium Voltage Electricity Distribution|South Sinai|Other Services
ريهانا|Medium Voltage Electricity Distribution|South Sinai|Hotels
قريا ريفايا|Medium Voltage Electricity Distribution|South Sinai|Hotels
إنتركونتيننتال روابي|Medium Voltage Electricity Distribution|South Sinai|Hotels
سفن|Medium Voltage Electricity Distribution|South Sinai|Hotels
إنفايرونمنت|Medium Voltage Electricity Distribution|South Sinai|Hotels
مول نبق|Medium Voltage Electricity Distribution|South Sinai|Shopping Center
إيجي دريم|Medium Voltage Electricity Distribution|South Sinai|Hotels
ترافكو هاوسينج|Medium Voltage Electricity Distribution|South Sinai|Hotels
أمواج|Medium Voltage Electricity Distribution|South Sinai|Hotels
أورورا|Medium Voltage Electricity Distribution|South Sinai|Hotels
أورورا سكن العاملين|Medium Voltage Electricity Distribution|South Sinai|Hotels
بارادايس بيتش|Medium Voltage Electricity Distribution|South Sinai|Hotels
بارسيلو تيران شرم|Medium Voltage Electricity Distribution|South Sinai|Hotels
تاور سنتر|Medium Voltage Electricity Distribution|South Sinai|Shopping Center
روف هوتيل|Medium Voltage Electricity Distribution|South Sinai|Hotels
تمارا بيتش|Medium Voltage Electricity Distribution|South Sinai|Hotels
مول عرب سات نبق للخدمات|Medium Voltage Electricity Distribution|South Sinai|Other Services
كورال سي ووتر وورلد|Medium Voltage Electricity Distribution|South Sinai|Hotels
جز ميرابيل|Medium Voltage Electricity Distribution|South Sinai|Hotels
كليوباترا سي فيو|Medium Voltage Electricity Distribution|South Sinai|Hotels
كليوباترا (الفناء الخلفي للكبار)|Medium Voltage Electricity Distribution|South Sinai|Hotels
لوميراج|Medium Voltage Electricity Distribution|South Sinai|Hotels
هايات شرم (المقر العالمي)|Medium Voltage Electricity Distribution|South Sinai|Hotels
باسادينا|Medium Voltage Electricity Distribution|South Sinai|Hotels
عروس شرم|Medium Voltage Electricity Distribution|South Sinai|Hotels
ريجنسي بلازا|Medium Voltage Electricity Distribution|South Sinai|Hotels
هاسكي|Medium Voltage Electricity Distribution|South Sinai|Hotels
جراند بلازا|Medium Voltage Electricity Distribution|South Sinai|Hotels
هاوسا|Medium Voltage Electricity Distribution|South Sinai|Hotels
نوبيان فيليدج|Medium Voltage Electricity Distribution|South Sinai|Hotels
لاجونا جاردن|Medium Voltage Electricity Distribution|South Sinai|Hotels
هوليداي فيليدج|Medium Voltage Electricity Distribution|South Sinai|Hotels
القصر شتاينبرجر|Medium Voltage Electricity Distribution|South Sinai|Hotels
ريهانا رويال|Medium Voltage Electricity Distribution|South Sinai|Hotels
شرم ريزيدنس|Medium Voltage Electricity Distribution|South Sinai|Hotels
لا سترادا|Medium Voltage Electricity Distribution|South Sinai|Hotels
شرم ليون سي كلوب أكوا بارك|Medium Voltage Electricity Distribution|South Sinai|Hotels
ريلانتكس/جولف هايتس|Medium Voltage Electricity Distribution|South Sinai|Hotels
سييرا ريزورت|Medium Voltage Electricity Distribution|South Sinai|Hotels
سي بيتش|Medium Voltage Electricity Distribution|South Sinai|Hotels
سيتي ستارز|Medium Voltage Electricity Distribution|South Sinai|Shopping Center
فودافون سابينا|Medium Voltage Electricity Distribution|South Sinai|Other Services
فودافون عروس شرم|Medium Voltage Electricity Distribution|South Sinai|Other Services
شرم أب - ذي فيو|Medium Voltage Electricity Distribution|South Sinai|Hotels
لا سيرينا|Medium Voltage Electricity Distribution|South Sinai|Hotels
فيفا ريف|Medium Voltage Electricity Distribution|South Sinai|Hotels
نبق للخدمات السياحية|Medium Voltage Electricity Distribution|South Sinai|Other Services
لايت شرم|Medium Voltage Electricity Distribution|South Sinai|Hotels
ريكسوس شرم|Medium Voltage Electricity Distribution|South Sinai|Hotels
مراقيا شرم|Medium Voltage Electricity Distribution|South Sinai|Hotels
فارعونا كينج سينفرو|Medium Voltage Electricity Distribution|South Sinai|Hotels
أكوا مارينا|Medium Voltage Electricity Distribution|South Sinai|Hotels
محطة مياه كورال سي|Medium Voltage Electricity Distribution|South Sinai|Water Plant
بالمز جراند بلازا|Medium Voltage Electricity Distribution|South Sinai|Hotels
سبلاش|Medium Voltage Electricity Distribution|South Sinai|Hotels
قوات حفظ السلام|Medium Voltage Electricity Distribution|South Sinai|Other Services
لاجونا ريزيدنس|Medium Voltage Electricity Distribution|South Sinai|Hotels
فانتازيا|Medium Voltage Electricity Distribution|South Sinai|Hotels
هايبر ماركت وايت آند نايت|Medium Voltage Electricity Distribution|South Sinai|Other Services
راغب سونز|Medium Voltage Electricity Distribution|South Sinai|Hotels
ريهانا هاوسينج|Medium Voltage Electricity Distribution|South Sinai|Hotels
ريكسوس هاوسينج|Medium Voltage Electricity Distribution|South Sinai|Hotels
مجمع الشرطة|Medium Voltage Electricity Distribution|South Sinai|Hotels
موناشرم|Medium Voltage Electricity Distribution|South Sinai|Hotels
ذي إيجيبشيان مول|Medium Voltage Electricity Distribution|South Sinai|Shopping Center
نبق هايتس|Medium Voltage Electricity Distribution|South Sinai|Hotels
بورتو لاجونا|Medium Voltage Electricity Distribution|South Sinai|Hotels
بورتو شرم|Medium Voltage Electricity Distribution|South Sinai|Hotels
القصر شتاينبرجر هاوسينج|Medium Voltage Electricity Distribution|South Sinai|Hotels
التخزين الطبي|Medium Voltage Electricity Distribution|South Sinai|Other Services
كوميتا|Medium Voltage Electricity Distribution|South Sinai|Hotels
ماشاريق|Medium Voltage Electricity Distribution|South Sinai|Hotels
مجمع سوان|Medium Voltage Electricity Distribution|South Sinai|Hotels
مول سحر الطبيعة|Medium Voltage Electricity Distribution|South Sinai|Shopping Center
شرطة المياه السطحية|Medium Voltage Electricity Distribution|South Sinai|Other Services
جويامول|Medium Voltage Electricity Distribution|South Sinai|Shopping Center
محمية نبق|Medium Voltage Electricity Distribution|South Sinai|Hotels
فودافون السنترال|Medium Voltage Electricity Distribution|South Sinai|Other Services
السور الأمني|Medium Voltage Electricity Distribution|South Sinai|Other Services
سور الريفية|Medium Voltage Electricity Distribution|South Sinai|Other Services
سور الشاربتلي|Medium Voltage Electricity Distribution|South Sinai|Other Services
سور بوابة نبق|Medium Voltage Electricity Distribution|South Sinai|Other Services
إنارة طريق المحافظة|Medium Voltage Electricity Distribution|South Sinai|Other Industries
سكن العاملين لاجونا|Medium Voltage Electricity Distribution|South Sinai|Hotels
محطة مياه دايموند|Medium Voltage Electricity Distribution|South Sinai|Water Plant
محطة مياه IU|Medium Voltage Electricity Distribution|South Sinai|Water Plant
ميترو ماركت|Medium Voltage Electricity Distribution|South Sinai|Other Services
بنك QNB|Medium Voltage Electricity Distribution|South Sinai|Other Services
تميم على على - معادن الومنيوم ق C1-2|Medium Voltage Electricity Distribution|Monufia|Aluminum
أجرو كايرو ق 8 - بلوك B1|Medium Voltage Electricity Distribution|Monufia|Food Industries
كابريول للصناعة إيجى كريت ق 10&12 بلوك A05|Medium Voltage Electricity Distribution|Monufia|Cement
النخبة لصناعة الأسمدة والمبيدات الزراعية ق 2-4-12-14 A02|Medium Voltage Electricity Distribution|Monufia|Fertilizers
جالاكسى للصناعات الزجاجية ق 8 بلوك A3|Medium Voltage Electricity Distribution|Monufia|Glass
سوبر بى لتصنيع القفازات ق 06 بلوك A02|Medium Voltage Electricity Distribution|Monufia|Other Industries
السلطان للأعلاف ق 2&4 بلوك B1|Medium Voltage Electricity Distribution|Monufia|Fertilizers
أفاق للإستثمار السياحى ق 2 بلوك A03|Medium Voltage Electricity Distribution|Monufia|Other Industries
هايدا إيجيبت المحدودة ق8 -10-18-20 بلوك B02|Medium Voltage Electricity Distribution|Monufia|Fertilizers
كيوبك فوم لصناعة الإسفنج ق 8 - 18 بلوك A2|Medium Voltage Electricity Distribution|Monufia|Other Industries
إى يو بى إيجيبت للصناعات 18-20-22-24-26-28 B3|Medium Voltage Electricity Distribution|Monufia|Other Industries
أسيا بلاست ق 20 بلوك A02|Medium Voltage Electricity Distribution|Monufia|Other Industries
بيسكو للمشروعات والمقاولات والصناعة ق12-14-16-18-20 بلوك C1|Medium Voltage Electricity Distribution|Monufia|Engineering Industries
برودال للصناعة C4-22|Low Voltage Electricity Distribution|Monufia|Food Industries
برودال للصناعة C4-24|Low Voltage Electricity Distribution|Monufia|Food Industries
شركة نيلوس فودز C4-04|Low Voltage Electricity Distribution|Monufia|Food Industries
شركة نيلوس فودز C4-06|Low Voltage Electricity Distribution|Monufia|Food Industries
شركة نيلوس فودز C4-08|Low Voltage Electricity Distribution|Monufia|Food Industries
هاي استاندرللبلاستيك والصناعات الخفيفة C04-16|Low Voltage Electricity Distribution|Monufia|Other Industries
سيجما مودرن للهندسة C04 -18|Low Voltage Electricity Distribution|Monufia|Engineering Industries
شركة نيلوس فودز C4-26|Low Voltage Electricity Distribution|Monufia|Food Industries
شركة نيلوس فودز C4-28|Low Voltage Electricity Distribution|Monufia|Food Industries
واى تى جى جروب YTG C04- 36|Low Voltage Electricity Distribution|Monufia|Engineering Industries
شركة ميدل ايست للأحبار C4 - 38|Low Voltage Electricity Distribution|Monufia|Other Industries
شركة اسباير للإلكترونيات C4 - 14|Low Voltage Electricity Distribution|Monufia|Other Industries
شركة اسباير للإلكترونيات C4 - 34|Low Voltage Electricity Distribution|Monufia|Other Industries
شركة سوفليت للصناعات الغذائية 10 - C04|Low Voltage Electricity Distribution|Monufia|Food Industries
جولدن وير ق 20 - C04|Low Voltage Electricity Distribution|Monufia|Textile & Spinning
فاليو كابيتال للإستثمارات C04 - 40|Low Voltage Electricity Distribution|Monufia|Other Industries
الأخوة للمواد الغذائية C05 - 02|Low Voltage Electricity Distribution|Monufia|Food Industries
الأخوة للمواد الغذائية C05 - 04|Low Voltage Electricity Distribution|Monufia|Food Industries
إرما إيجيبت للصناعات الكيماوية ق 32 - C05|Low Voltage Electricity Distribution|Monufia|Petrochemicals
فيرت لاين ق 18- C05|Low Voltage Electricity Distribution|Monufia|Other Industries
بتروسيرفيس إنترناشيونال للإستثمار 38 - C05|Low Voltage Electricity Distribution|Monufia|Petrochemicals
شركة البيان للصناعت الغذائية 06 - C05|Low Voltage Electricity Distribution|Monufia|Food Industries
شركة البيان للصناعت الغذائية08 - C05|Low Voltage Electricity Distribution|Monufia|Food Industries
شركة البيان للصناعت الغذائية 10 - C05|Low Voltage Electricity Distribution|Monufia|Food Industries
أركان للتنمية الزراعية 12 - C05|Low Voltage Electricity Distribution|Monufia|Fertilizers
فيلا لصناعة الأحذية C05 - 14|Low Voltage Electricity Distribution|Monufia|Textile & Spinning
جو جرين ( شركة تضامن ) C05-30|Low Voltage Electricity Distribution|Monufia|Other Industries
فيلا لصناعة الأحذية C05 - 34|Low Voltage Electricity Distribution|Monufia|Textile & Spinning
ايجيبت بلاست C05 - 40|Low Voltage Electricity Distribution|Monufia|Other Industries
بلو واتر ( شركة تضامن ) C05 - 16|Low Voltage Electricity Distribution|Monufia|Other Industries
بلو واتر ( شركة تضامن ) C05 - 24|Low Voltage Electricity Distribution|Monufia|Other Industries
شركة البيان للصناعت الغذائية 26 - C05|Low Voltage Electricity Distribution|Monufia|Food Industries
شركة البيان للصناعت الغذائية 28 - C05|Low Voltage Electricity Distribution|Monufia|Food Industries
تكنوسيل C05 - 36|Low Voltage Electricity Distribution|Monufia|Other Industries
السلام الدولية للتنمية والإستثمار الزراعى 20 - C05|Low Voltage Electricity Distribution|Monufia|Other Industries
ايلسا للصناعات للغذائية C06 02|Low Voltage Electricity Distribution|Monufia|Food Industries
ايلسا للصناعات للغذائية C06 04|Low Voltage Electricity Distribution|Monufia|Food Industries
ايه تى ام المتحدة للتصدير والتوريدات العمومية ق 8|Low Voltage Electricity Distribution|Monufia|Other Industries
الحياة للتوريدات الطبية ق 10 C06|Low Voltage Electricity Distribution|Monufia|Pharmaceuticals
أر إى إس للصناعات الهندسية ق C0612|Low Voltage Electricity Distribution|Monufia|Iron & Steel
يورونوكس للهندسة والمقاولات ق 14 C06|Low Voltage Electricity Distribution|Monufia|Engineering Industries
جرين أبل للإستثمار السياحى ق 20 C06|Low Voltage Electricity Distribution|Monufia|Other Industries
ايلسا للصناعات للغذائية C06 22|Low Voltage Electricity Distribution|Monufia|Food Industries
ايلسا للصناعات للغذائية C06 24|Low Voltage Electricity Distribution|Monufia|Food Industries
ايه تى ام المتحدة للتصدير والتوريدات العمومية ق 28|Low Voltage Electricity Distribution|Monufia|Other Industries
الحياة للتوريدات الطبية ق 30 C06|Low Voltage Electricity Distribution|Monufia|Pharmaceuticals
يورونوكس للهندسة والمقاولات ق 34 C06|Low Voltage Electricity Distribution|Monufia|Engineering Industries
جرين أبل للإستثمار السياحى ق 40 C06|Low Voltage Electricity Distribution|Monufia|Other Industries
أباظة للإستيراد والتصدير ق 30 C07|Low Voltage Electricity Distribution|Monufia|Other Industries
الألمانية لخطوط الدرفلة والتقطيع ق32 C07|Low Voltage Electricity Distribution|Monufia|Iron & Steel
الكندية لصناعة الكرتون ق 36|Medium Voltage Electricity Distribution|Monufia|Other Industries
دى سى اندسترينز ق 40-42-84|Medium Voltage Electricity Distribution|Monufia|Cement
جديلة للصناعات المعدنية ق 41|Medium Voltage Electricity Distribution|Monufia|Other Industries
المجد 1 للصناعات البلاستيكية ق71-72-75|Medium Voltage Electricity Distribution|Monufia|Other Industries
الشروق للصناعات الورقية 73+76|Medium Voltage Electricity Distribution|Monufia|Other Industries
سمارت كوبر للصناعة 1|Medium Voltage Electricity Distribution|Monufia|Other Industries
القدس للبلاستيك B04|Medium Voltage Electricity Distribution|Monufia|Other Industries
الواحة للإستيراد والتصدير S11+S12|Medium Voltage Electricity Distribution|Monufia|Other Industries
كمال عبد الحميد عبد العظيم محمد هيكل A16|Low Voltage Electricity Distribution|Monufia|Other Industries
الترا اليكتريك اند بى فى سى A20|Low Voltage Electricity Distribution|Monufia|Other Industries
كارى للصناعات الغذائية ( 6 - 9 ) F2|Medium Voltage Electricity Distribution|Monufia|Other Industries
النور لتصنيع منتجات البلاستيك ق (13-1) قطاع C|Medium Voltage Electricity Distribution|Monufia|Other Industries
الشرق لخدمة وتموين السيارات SR 3 -7|Low Voltage Electricity Distribution|Monufia|Other Industries
أكاديمية السويدى ( كشك المدرسة ) 630 ك.ف.أ|Low Voltage Electricity Distribution|Monufia|Other Industries
كشك المبنى الإدارى|Service Voltage Electricity Distribution|Monufia|Other Services
كشك الخزان|Service Voltage Electricity Distribution|Monufia|Other Services
ام أند اي لتصنيع الزجاج (7-8-11-12-13-16 ) E2|Medium Voltage Electricity Distribution|Monufia|Glass
فقد كشك 34 ( الخزان )|Service Voltage Electricity Distribution|Monufia|Other Services
فقد المطور من كشك 51|Service Voltage Electricity Distribution|Monufia|Other Services
فقد استهلاك المطور من كشك 14|Service Voltage Electricity Distribution|Monufia|Other Services
فقد كشك 13 المغذى لبلوك C06|Service Voltage Electricity Distribution|Monufia|Other Services
فقد كشك 12 المغذى لبلوك C07|Service Voltage Electricity Distribution|Monufia|Other Services
فقد كشك 11 المغذى لبلوك C08|Service Voltage Electricity Distribution|Monufia|Other Services
فقد كشك 42 المغذى لبلوك C09|Service Voltage Electricity Distribution|Monufia|Other Services
فقد المطور بولاريس من كشك البوصلة|Service Voltage Electricity Distribution|Monufia|Other Services
فقد خدمات المطورمن الكشك|Service Voltage Electricity Distribution|Monufia|Other Services
فقد كشك الموزع 160 ك.ف.أ|Service Voltage Electricity Distribution|Monufia|Other Services
فقد كشك الإنارة 1 500 ك.ف.أ|Service Voltage Electricity Distribution|Monufia|Other Services
فقد كشك الإنارة 2 500 ك.ف.أ|Service Voltage Electricity Distribution|Monufia|Other Services
مكتب المشهور للإستيراد والتصدير A23-A24-A25|Low Voltage Electricity Distribution|Monufia|Other Industries
العالمية للاستثمار الغذائي|Low Voltage Electricity Distribution|Monufia|Other Industries
مصر تركيا للمنتجات الورقية|Medium Voltage Electricity Distribution|Monufia|Other Industries
مالتي كيميكال لصناعة وتجارة الكيماويات|Medium Voltage Electricity Distribution|Monufia|Other Industries
شركة اليسر للبلاستيك|Low Voltage Electricity Distribution|Monufia|Other Industries
المصرية لحلول التخزين والمناوله|Low Voltage Electricity Distribution|Monufia|Other Industries
شركة المركز الفني للتصنيع سنتك|Low Voltage Electricity Distribution|Monufia|Other Industries
الاتحاد للوازم الورش والمصانع - صابر عبد الحافظ محمد فرج|Medium Voltage Electricity Distribution|Monufia|Other Industries
عمار|O&M Contract|Cairo|Residential Complex
جاليريا-٤٠|O&M Contract|Giza|Shopping Center
مول طنطا|O&M Contract|Gharbia|Shopping Center
مول السلام|O&M Contract|Cairo|Shopping Center
أوراسكوم-أو ويست|O&M Contract|Giza|Residential Complex
بالم سبرينجز|O&M Contract|Giza|Residential Complex
البروج|O&M Contract|Cairo|Residential Complex
بالم سترب|O&M Contract|Giza|Shopping Center
القرية الدبلوماسية|O&M Contract|Matrouh|Hotels
مراسم_الخامس سكوير|O&M Contract|Cairo|Shopping Center
رسلان (سكوير وان)|O&M Contract|Cairo|Shopping Center
السادات|Low Voltage Electricity Distribution|Monufia|Other Industries
سيتي إيدج - إيتابا|O&M Contract|Giza|Shopping Center
جيد - رياض سيكون|O&M Contract|Cairo|Residential Complex
أورا_زد ويست|O&M Contract|Giza|Shopping Center
أزاد|O&M Contract|Cairo|Residential Complex
أورا_زد إيست|O&M Contract|Cairo|Shopping Center
سكاي ووك مول|O&M Contract|Giza|Shopping Center
إل إم دي-جاردن ٨|O&M Contract|Cairo|Other Services
إم آي_القاهرة بيزنس بارك|O&M Contract|Cairo|Other Services
قطري ديار (سيتي جيت)|O&M Contract|Cairo|Shopping Center
مصر إيطاليا_كاي سخن|O&M Contract|Suez|Hotels
ون ناينتي|O&M Contract|Cairo|Shopping Center
إي-ستايرينك|Power Generation|Alexandria|Petrochemicals
جي بي سي|Power Generation|New Valley|Petrochemicals
محطة مياه الريفية1|Medium Voltage Electricity Distribution|South Sinai|Water Plant
نفنيتي اي للتوريد وشحن السيارات1|Medium Voltage Electricity Distribution|South Sinai|Other Services
نفنيتي اي للتوريد وشحن السيارات2|Medium Voltage Electricity Distribution|South Sinai|Other Services
محطة مياه الريفية2|Medium Voltage Electricity Distribution|South Sinai|Water Plant
محمد رشوان محمد-المصرية لحلول التخزين والمناولة1|Low Voltage Electricity Distribution|Monufia|Other Industries
محمد رشوان محمد-المصرية لحلول التخزين والمناولة2|Low Voltage Electricity Distribution|Monufia|Other Industries
مزارع دينا|Solar Power Plant|Cairo|Food Industries
سوما باي|Solar Power Plant|Red Sea|Hotels
أسكوم|Solar Power Plant|Minya|Other Industries
نبق|Solar Power Plant|South Sinai|Hotels
المنطقة الصناعية طاقة|Solar Power Plant|Cairo|Other Industries
شاطئ نوبيا|Solar Power Plant|South Sinai|Hotels
أتش بى جروب الصناعية (سيراميكا أرت)|Medium Voltage Electricity Distribution|Giza|Ceramics & Porcelain
جلوبال ادفانسد للبويات والكيماويات|Medium Voltage Electricity Distribution|Giza|Petrochemicals
العربيه لتصنيع ودهان الالومنيوم (الجيزه للمعادن لصناعة الأسلاك المعدنية سابقا)|Medium Voltage Electricity Distribution|Giza|Aluminum
أوول ورلد للتجارة والتوكيلات(العزبي)|Medium Voltage Electricity Distribution|Giza|Other Services
كونكورد للخرسانة الجاهزة|Medium Voltage Electricity Distribution|Giza|Cement
الجيزة لصناعة الكابلات|Medium Voltage Electricity Distribution|Giza|Engineering Industries
الورال إيجيبت لصناعات الألومنيوم المعمارى|Medium Voltage Electricity Distribution|Giza|Aluminum
إيجى ميد للصناعة والتجارة|Medium Voltage Electricity Distribution|Giza|Other Industries
الحازم للمقاولات|Medium Voltage Electricity Distribution|Giza|Other Industries
ماميبا لمستحضرات التجميل|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
بروجلاس إيجيبت للأعمال الزجاجية|Medium Voltage Electricity Distribution|Giza|Glass
الأهلية التجارية للأعمال الزراعية والكيماوية والصناعية|Medium Voltage Electricity Distribution|Giza|Fertilizers
سان مارك (ماجد سمير وشريكيه)نسيج|Medium Voltage Electricity Distribution|Giza|Textile & Spinning
بريمكو ريدي ميكس|Medium Voltage Electricity Distribution|Giza|Cement
فليكس بى فيلمز إيجيبت|Medium Voltage Electricity Distribution|Giza|Other Services
العالمية للمواد الإستهلاكية والأغذية|Medium Voltage Electricity Distribution|Giza|Food Industries
المصنع التخصصي للمنتجات الحديدية|Medium Voltage Electricity Distribution|Giza|Iron & Steel
المتحدة للصناعة|Medium Voltage Electricity Distribution|Giza|Iron & Steel
روتو لتصنيع الادوات الكتابيه والاستثمار الصناعي|Medium Voltage Electricity Distribution|Giza|Iron & Steel
الموردون المصريون للتجارة والتصنيع|Medium Voltage Electricity Distribution|Giza|Petrochemicals
مجموعة التنمية الصناعية IDG|Medium Voltage Electricity Distribution|Giza|Other Services
بريق لتقنيات الصناعات المتطورة|Medium Voltage Electricity Distribution|Giza|Petrochemicals
التطوير للصناعات الغذائية (دومتي)|Medium Voltage Electricity Distribution|Giza|Food Industries
ايجيبت اوري ميكس لمنتجات الخرسانة|Medium Voltage Electricity Distribution|Giza|Cement
عبر الخليج للبلاستيك|Medium Voltage Electricity Distribution|Giza|Petrochemicals
محرز لتحويل وتصنيع الورق|Medium Voltage Electricity Distribution|Giza|Other Industries
مجموعة التريا للإستثمار الصناعى والزراعى (الترياق لتصنيع وتشغيل المكثفات سابقاً)|Medium Voltage Electricity Distribution|Giza|Other Industries
راجاميك ايجيبت للتجارة العامة (العلا للصناعات الهندسية سابقاً)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
القاهرة لإنتاج العبوات (كايرو باك)|Medium Voltage Electricity Distribution|Giza|Other Services
اكتوبر لتصنيع المكرونة|Medium Voltage Electricity Distribution|Giza|Food Industries
انفوفورت إيجيبت|Medium Voltage Electricity Distribution|Giza|Other Services
السلامة لمواد الطرق (سارماك)|Medium Voltage Electricity Distribution|Giza|Other Industries
السعودية لصناعه المواسير ولوازمها|Medium Voltage Electricity Distribution|Giza|Iron & Steel
السعيدة لطحن السكر|Medium Voltage Electricity Distribution|Giza|Food Industries
أرامكس مشرق للخدمات اللوجيستية|Medium Voltage Electricity Distribution|Giza|Other Services
المصرية لتصميم وتصنيع النظم الإلكترونية والتحكم الآلى (ايجي ترونكس)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
(برنتك)بيان لصناعات الطباعة والتغليف|Medium Voltage Electricity Distribution|Giza|Other Services
المتحدة للمبانى المعدنية (رووتس)|Medium Voltage Electricity Distribution|Giza|Iron & Steel
البردى لصناعة الورق|Medium Voltage Electricity Distribution|Giza|Other Industries
الهندسية للصناعات التكنولوجية (ECTI)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
البستانى للصناعات الهندسية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
هاي تك جرافيكس|Medium Voltage Electricity Distribution|Giza|Other Services
نجاتكس للصناعات النسيجية (لومتكس للصناعات النسيجية سابقاً)|Medium Voltage Electricity Distribution|Giza|Textile & Spinning
اجرو إيجيبت للمنتجات الزراعية (غلاب)|Medium Voltage Electricity Distribution|Giza|Food Industries
سيفيا لمستحضرات التجميل والعطور|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
الخرسانه سابقه الصب (بريمكو مصر)|Medium Voltage Electricity Distribution|Giza|Cement
فوتوراتك لتصنيع المكسبات|Medium Voltage Electricity Distribution|Giza|Food Industries
محمد عصام محمد محمد وشركاه|Medium Voltage Electricity Distribution|Giza|Other Industries
تكنولوجيا الهندسة والصيانة (ايست)|Medium Voltage Electricity Distribution|Giza|Other Services
سوميت بي أم سي لمنتجات جي أر بي (ميدي فيكس لتصنيع المستلزمات الطبية سابقا)|Medium Voltage Electricity Distribution|Giza|Other Services
المصرية لصناعة المواسير ولوازمها (أكوا فلو)|Medium Voltage Electricity Distribution|Giza|Iron & Steel
جلوبال ترونكس للإلكترونيات|Medium Voltage Electricity Distribution|Giza|Engineering Industries
العامة للمشروعات الفنية (تيبكو)|Medium Voltage Electricity Distribution|Giza|Other Services
ايجي ستيل للمقاولات والتوريدات|Medium Voltage Electricity Distribution|Giza|Iron & Steel
الثلاثية لتصنيع المعدات (تيترا)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
فونتانا (بهجت الاكوح)|Medium Voltage Electricity Distribution|Giza|Petrochemicals
المصرية لتنمية الصناعات الغذائية والزراعات العضوية (نبته فودز)|Medium Voltage Electricity Distribution|Giza|Food Industries
مكتب العش|Medium Voltage Electricity Distribution|Giza|Other Services
فاو لصناعة السيارات|Medium Voltage Electricity Distribution|Giza|Engineering Industries
كانكس لسحب الألمنيوم|Medium Voltage Electricity Distribution|Giza|Aluminum
نافكو مصر لمعدات مكافحة الحريق|Medium Voltage Electricity Distribution|Giza|Engineering Industries
مطر للمصاعد والسلالم الكهربائية (الفا مطر) - ماهر محمد محمد مطر وشريكته|Medium Voltage Electricity Distribution|Giza|Engineering Industries
كلورايد إيجيبت|Medium Voltage Electricity Distribution|Giza|Other Services
كامل بيكرى للمنتجات الغذائية (كوكى مان)|Medium Voltage Electricity Distribution|Giza|Food Industries
دي بي جي دلمار(أر كى دبليو إيجيبت (RKW)سابقا)|Medium Voltage Electricity Distribution|Giza|Other Services
فرست بلاست للأدوات الصحية ربيع محمد محمد كفافي و شركاه|Medium Voltage Electricity Distribution|Giza|Other Industries
صناعة البلاستيك الهندسية (EPM)|Medium Voltage Electricity Distribution|Giza|Petrochemicals
العالمية للصناعات المعدنية|Medium Voltage Electricity Distribution|Giza|Iron & Steel
دلتا الدولية للصناعة والإلكترونيات|Medium Voltage Electricity Distribution|Giza|Other Services
مارينا للصناعات الهندسية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
الألمانية للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
إتصال للصناعات المتطورة (أكوا كيارا إيجيبت سابقاً / إنتجرا لأعمال الطباعة سابقاً)|Medium Voltage Electricity Distribution|Giza|Other Industries
بى اف للأقمشة غير المنسوجة|Medium Voltage Electricity Distribution|Giza|Textile & Spinning
رفعت شوقى محمد وشريكه|Medium Voltage Electricity Distribution|Giza|Other Services
إيجيبت برايت تكنولوجى فيدز|Medium Voltage Electricity Distribution|Giza|Other Services
المصرية للإتصالات|Medium Voltage Electricity Distribution|Giza|Other Services
بوستيك إيجيبت لإنتاج المواد اللاصقة|Medium Voltage Electricity Distribution|Giza|Petrochemicals
الإنتاج لصناعة السيلفوكيماويات مصر|Medium Voltage Electricity Distribution|Giza|Petrochemicals
الكبوس للتجارة والصناعة|Medium Voltage Electricity Distribution|Giza|Other Services
المتحدة لإقامة المشاريع الصناعية (عياد بخيت سعيد ناروز و شريكته)|Medium Voltage Electricity Distribution|Giza|Iron & Steel
شركه كالين لتصنيع وإنتاج مستحضرات التجميل|Medium Voltage Electricity Distribution|Giza|Engineering Industries
فلكسوباك لتكنولوجيا الطباعة|Medium Voltage Electricity Distribution|Giza|Other Services
إنتراسيكشنز|Medium Voltage Electricity Distribution|Giza|Engineering Industries
أمجد عريان كيرلس وشريكه|Medium Voltage Electricity Distribution|Giza|Other Services
نستلة مصر (كارافان للتسويق سابقاً)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
تنمية مصانع حلويات الرشيدى الميزان|Medium Voltage Electricity Distribution|Giza|Food Industries
إيجل بوليمرز الي سابقا (ايجل كيميكالز لصناعة وتجارة الكيماويات|Medium Voltage Electricity Distribution|Giza|Other Services
المصرية لمواد التعبئة والتغليف (المنشأة المصرية الألمانية الحديثة للصناعات الغذائية سابقاً)|Medium Voltage Electricity Distribution|Giza|Food Industries
تكنو كانز|Medium Voltage Electricity Distribution|Giza|Engineering Industries
الأميرة للبلاستيك – محمد إبراهيم صابر سرور حسن|Medium Voltage Electricity Distribution|Giza|Petrochemicals
رأفت سمير الخناجرى للتصنيع|Medium Voltage Electricity Distribution|Giza|Other Services
أماندا لمستحضرات التجميل (أماندا)|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
مصر إكسبريس للتجارة والتوزيع|Medium Voltage Electricity Distribution|Giza|Other Services
الهندسية للصناعات المتطورة|Medium Voltage Electricity Distribution|Giza|Other Services
المصرية للانتاج الورق الصحى ( فيفا )|Medium Voltage Electricity Distribution|Giza|Other Industries
برومو برنت|Medium Voltage Electricity Distribution|Giza|Other Services
روسوس للحلويات و البسكويت – ورثة ادريس على عليان|Medium Voltage Electricity Distribution|Giza|Food Industries
كينج ستيل لتشكيل وتقطيع المعادن (جى اى تى اليكتريك سابقاً)|Medium Voltage Electricity Distribution|Giza|Iron & Steel
المتحدة للطوب بريكو(رتاج)|Medium Voltage Electricity Distribution|Giza|Brick Kilns
هاوس أوف فريش|Medium Voltage Electricity Distribution|Giza|Engineering Industries
وارد للخدمات اللوجيستية|Medium Voltage Electricity Distribution|Giza|Other Services
عبور لاند للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
حلول التقنية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
ستوديو برو لخدمات التصوير السينمائى والتليفزيونى|Medium Voltage Electricity Distribution|Giza|Other Services
إتش بي فوللر للمواد اللاصقة|Medium Voltage Electricity Distribution|Giza|Petrochemicals
اورجانو لصناعة الأعلاف|Medium Voltage Electricity Distribution|Giza|Other Industries
فينا للتجهيزات والتوريدات الطبية|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
سعد محمود رسلان وشركاه للتجارة الدولية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
أمكون للصناعات|Medium Voltage Electricity Distribution|Giza|Other Services
المصنع العربى لصناعة مراتب السوست والأسفنج والأتكس|Medium Voltage Electricity Distribution|Giza|Other Services
المصرية للعدسات اللاصقة|Medium Voltage Electricity Distribution|Giza|Other Industries
العربية للصناعات الخشبية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
الأهرام لصناعة الورق والكرتون|Medium Voltage Electricity Distribution|Giza|Other Services
دلمار لإنتاج قطاعات الأمنيوم|Medium Voltage Electricity Distribution|Giza|Other Services
المصرية للصناعات الهندسيه|Medium Voltage Electricity Distribution|Giza|Engineering Industries
إليف العالمية لمنتجات التعبئة والتغليف|Medium Voltage Electricity Distribution|Giza|Other Industries
أكديما إنترناشيونال للتجارة|Low Voltage Electricity Distribution|Giza|Pharmaceuticals
المعادى للتجارة|Medium Voltage Electricity Distribution|Giza|Other Services
الشروق للخدمات البترولية والإستيراد والتصدير|Low Voltage Electricity Distribution|Giza|Petroleum Products
الاسكندرية للحلويات والشوكلاته|Medium Voltage Electricity Distribution|Giza|Engineering Industries
فوكس للإدارة والتعمير|Low Voltage Electricity Distribution|Giza|Other Services
مينا بطرس عياد فارس وشركاه (معرض المرمر للمنزل الحديث)|Low Voltage Electricity Distribution|Giza|Other Services
هاى ستيل - أحمد فتحى مصطفى على|Low Voltage Electricity Distribution|Giza|Iron & Steel
مصنع برو باك لصاحبها إبراهيم أحمد شكرى إبراهيم شكرى|Low Voltage Electricity Distribution|Giza|Other Industries
الواحة للمقاولات والتوريدات والأعمال الكهربائية|Low Voltage Electricity Distribution|Giza|Engineering Industries
بروفنسال للتجارة والصناعة|Low Voltage Electricity Distribution|Giza|Iron & Steel
عبر البلاد للصناعة والتجارة|Low Voltage Electricity Distribution|Giza|Other Services
جلوبال للصناعات الهندسية (محمد يوسف حسن وشركاه)|Low Voltage Electricity Distribution|Giza|Engineering Industries
الهندسية للتجارة وتشغيل المعادن – انجماتكو (سيد عبد المنعم وشركاه)|Low Voltage Electricity Distribution|Giza|Iron & Steel
ولاعة الصناعات الصغيرة (1)|Service Voltage Electricity Distribution|Giza|Other Services
المصرية لصناعة العدادات الذكية|Low Voltage Electricity Distribution|Giza|Engineering Industries
بداية لأنظمة الإضاءة|Low Voltage Electricity Distribution|Giza|Engineering Industries
طاقة للأسلاك والكابلات الكهربائية - كابلات طاقة|Low Voltage Electricity Distribution|Giza|Engineering Industries
المتحدة للصناعات الحيوية - بيو إيجيبت|Low Voltage Electricity Distribution|Giza|Other Industries
أبناء مصر للتعمير|Low Voltage Electricity Distribution|Giza|Other Industries
إيميجن|Low Voltage Electricity Distribution|Giza|Other Services
لوحة غرفه 2- CPC|Service Voltage Electricity Distribution|Giza|Other Services
خزان الحريق-CPC|Service Voltage Electricity Distribution|Giza|Other Services
ميجا برنت (أيمن صبحي عياد سليمان وشريكه)|Low Voltage Electricity Distribution|Giza|Other Services
أكوا بلاست للصناعات الحديثة (المصرية الأسبانية للصناعات البلاستيكية (روكا بلاست) سابقاً)|Low Voltage Electricity Distribution|Giza|Petrochemicals
الصفوة للصناعة الهندسية (محمد فاروق إبراهيم وشركاه)|Low Voltage Electricity Distribution|Giza|Engineering Industries
فاير وول لأنظمة الإطفاء (هيمتس لكيماويات الإنشاءات سابقاً)|Low Voltage Electricity Distribution|Giza|Engineering Industries
الهندسية للخدمات الصناعية-ليدر جروب سابقا|Low Voltage Electricity Distribution|Giza|Other Services
المتطورة للصناعات الهندسية (محسن محمد عبده حجاج وفؤاد محسن محمد عبده)|Low Voltage Electricity Distribution|Giza|Engineering Industries
هاي ستيل (المتطوره للصناعات الهندسيه سابقا)|Low Voltage Electricity Distribution|Giza|Iron & Steel
لوحة غرفه 5 - CPC|Service Voltage Electricity Distribution|Giza|Other Services
ميدل إيست للتوريدات الكهربائية|Low Voltage Electricity Distribution|Giza|Engineering Industries
رفوف للصناعات الهندسية|Low Voltage Electricity Distribution|Giza|Iron & Steel
نيوتك لتشغيل المعادن وتصنيع محابس المياه (إنفنتى ليد لحلول الطاقة سابقاً)|Low Voltage Electricity Distribution|Giza|Engineering Industries
العالمية للهندسة والتجارة (ياسر أبوسريع حسين وشريكه)|Low Voltage Electricity Distribution|Giza|Other Industries
بيت الخبرة للبلاستيك|Low Voltage Electricity Distribution|Giza|Petrochemicals
ديفا جى كوزماتكس|Low Voltage Electricity Distribution|Giza|Pharmaceuticals
مركز إمداد لمواد الخام|Low Voltage Electricity Distribution|Giza|Other Industries
فاروق سيستمز للتصنيع|Low Voltage Electricity Distribution|Giza|Other Services
لوحه غرفم 3 - CPC|Service Voltage Electricity Distribution|Giza|Other Services
أكوا بلاست للصناعات الحديثة|Low Voltage Electricity Distribution|Giza|Other Industries
أمبيت كوك (مينا بطرس عياد فارس)|Low Voltage Electricity Distribution|Giza|Other Industries
المتحدة للإضاءة الحديثة|Low Voltage Electricity Distribution|Giza|Engineering Industries
CPC ( شركة والونج للإكسسوارات ومستلزمات الملابس )|Low Voltage Electricity Distribution|Giza|Other Services
بيولينك إيجيبت للصناعات الكيماوية|Medium Voltage Electricity Distribution|Giza|Petrochemicals
المختبر للتحاليل الطبية|Low Voltage Electricity Distribution|Giza|Other Services
بيتا إلكتريك للصناعات|Low Voltage Electricity Distribution|Giza|Engineering Industries
لوحة غرفه 4 CPC|Service Voltage Electricity Distribution|Giza|Other Services
خزان مياه|Service Voltage Electricity Distribution|Giza|Other Services
لوحة الصرف / محطة الرفع|Service Voltage Electricity Distribution|Giza|Other Services
ولاعة إنارة (1)|Service Voltage Electricity Distribution|Giza|Other Services
بولى تك للبلاستيك والكيماويات|Medium Voltage Electricity Distribution|Giza|Petrochemicals
ولاعة إنارة (2)|Service Voltage Electricity Distribution|Giza|Other Services
ولاعة إنارة (3)|Service Voltage Electricity Distribution|Giza|Other Services
ولاعة إنارة (4)|Service Voltage Electricity Distribution|Giza|Other Services
سى بى سى (شركة الخبرة والتثمين)|Low Voltage Electricity Distribution|Giza|Other Services
سى بى سى (طنبو)|Low Voltage Electricity Distribution|Giza|Food Industries
بستاني لتصنيع ماكينات القهوة (الخليفه سابقا)|Low Voltage Electricity Distribution|Giza|Engineering Industries
التخصصية للمقاولات الكهروميكانيكية (سيمكو)|Low Voltage Electricity Distribution|Giza|Engineering Industries
سولو سوفت للورق الصحى (باك تك السادس من أكتوبر سابقاً)|Medium Voltage Electricity Distribution|Giza|Other Services
الأندلس للصناعة والتجارة (سعدعادل ديبو وشريكيه)|Low Voltage Electricity Distribution|Giza|Other Services
هيربال هاوس سنترز|Low Voltage Electricity Distribution|Giza|Other Services
إيجيكان (عصام خاطر المرسى دويك)|Low Voltage Electricity Distribution|Giza|Other Services
أيكو باك للتجارة والصناعة|Medium Voltage Electricity Distribution|Giza|Other Services
اجرى سولار|Low Voltage Electricity Distribution|Giza|Engineering Industries
سامى وشركاه للتصدير والإستيراد والتوكيلات التجارية|Low Voltage Electricity Distribution|Giza|Other Services
كاريمكو لتصنيع وتشغيل المعادن|Medium Voltage Electricity Distribution|Giza|Engineering Industries
المصرية الدانماركية لصناعات المعدات ادكو (محموج أمد سيد عارف وشركاه)|Low Voltage Electricity Distribution|Giza|Engineering Industries
فود إنوفيشن للصناعات الغذائيه|Medium Voltage Electricity Distribution|Giza|Other Services
السويدى باور للكابلات|Low Voltage Electricity Distribution|Giza|Engineering Industries
بن شاهين|Medium Voltage Electricity Distribution|Giza|Other Services
الأندلس تريدينج للتجارة العامة|Low Voltage Electricity Distribution|Giza|Other Services
ابوتيك باى لخلاصات النباتات الطبيعية والعطرية|Medium Voltage Electricity Distribution|Giza|Other Services
زدني فوود|Medium Voltage Electricity Distribution|Giza|Other Services
التجارية للخدمات الهندسية المتكاملة (أيتس)|Low Voltage Electricity Distribution|Giza|Other Services
اى ال ال اى للتجارة والتصنيع|Medium Voltage Electricity Distribution|Giza|Other Services
أس اى دى اتش او ام لصناعة وتجارة خامات ومستلزمات الطباعة|Low Voltage Electricity Distribution|Giza|Other Services
كوين للدعاية وتوريدات المواد الدعائية|Low Voltage Electricity Distribution|Giza|Other Services
دوهلر مصر لتصنيع المأكولات والمشروبات الطبيعية|Medium Voltage Electricity Distribution|Giza|Food Industries
بولى كيم (محمد السيد العشرى وشركاه)|Low Voltage Electricity Distribution|Giza|Other Services
نيو ايجيبت للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
ام اند ايه لتصنيع الزجاج (M&A)|Medium Voltage Electricity Distribution|Giza|Other Services
الأوائل للصناعات الغذائية (محمد أدريس على أحمد وشركاه)|Low Voltage Electricity Distribution|Giza|Food Industries
المنجد للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Other Services
أويستر للإستثمار العقارى (جيهان شعبان مصطفى أحمد بقله)|Low Voltage Electricity Distribution|Giza|Other Services
Media Tech- ميديا تك|Medium Voltage Electricity Distribution|Giza|Other Services
القطعة رقم 175 -أ|Medium Voltage Electricity Distribution|Giza|Other Services
القطعة رقم 175-ب|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
بوليجون فارما|Medium Voltage Electricity Distribution|Giza|Other Services
عمارة ( 1 )|Low Voltage Electricity Distribution|Giza|Residential Complex
برج إتصالات Orange|Service Voltage Electricity Distribution|Giza|Other Services
إنشاء للصناعات الهندسية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
عمارة ( 2 )|Low Voltage Electricity Distribution|Giza|Residential Complex
أمسيو للصناعات الطبية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
ولاعة إنارة المبنى السكنى|Service Voltage Electricity Distribution|Giza|Other Services
برنت فور باك للطباعه والتغليف (تريس الدولية لتصنيع الأخشاب سابقاً)|Medium Voltage Electricity Distribution|Giza|Other Services
الملعب|Service Voltage Electricity Distribution|Giza|Other Services
جى كريستال للصناعات البلاستيكية|Medium Voltage Electricity Distribution|Giza|Petrochemicals
عادل عبد الجواد محمد فايد وشريكه - الفاتك|Medium Voltage Electricity Distribution|Giza|Other Services
منسوجات مصر أحمد حمدى عبد الجليل البرلسى وشركاه|Medium Voltage Electricity Distribution|Giza|Other Services
F.C. مطعم 4|Service Voltage Electricity Distribution|Giza|Other Services
تغذية فودز|Medium Voltage Electricity Distribution|Giza|Other Services
F.C. مطعم 2|Service Voltage Electricity Distribution|Giza|Other Services
الحكيم للإستثمار الصناعى|Medium Voltage Electricity Distribution|Giza|Other Services
F.C. مطعم 3|Service Voltage Electricity Distribution|Giza|Other Services
كريتيماتك للهياكل الخرسامية والمعدنية سابقة التجهيز|Medium Voltage Electricity Distribution|Giza|Engineering Industries
F.C. مطعم 5|Service Voltage Electricity Distribution|Giza|Other Services
ايست باك للاستثمار|Medium Voltage Electricity Distribution|Giza|Other Services
المجموعة المتحدة للمطاحن|Medium Voltage Electricity Distribution|Giza|Engineering Industries
F.C. مطعم 6|Service Voltage Electricity Distribution|Giza|Other Services
إيتاكو للصناعات المتقدمة|Medium Voltage Electricity Distribution|Giza|Other Services
F.C. مطعم 8|Service Voltage Electricity Distribution|Giza|Other Services
فيوتشر فودز للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
F.C. مطعم 7|Service Voltage Electricity Distribution|Giza|Other Services
الفرسان الدولية للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
F.C. مطعم 9|Service Voltage Electricity Distribution|Giza|Other Services
F.C. WC دورة مياه|Service Voltage Electricity Distribution|Giza|Other Services
دهب فور سيزون للمطاحن والصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Other Services
CPC - # 104b (2)|Service Voltage Electricity Distribution|Giza|Other Services
CPC - # 301 a/b (3)|Service Voltage Electricity Distribution|Giza|Other Services
المصرية الفرنسية للصناعات الغذائية ومنتجات اللحوم|Medium Voltage Electricity Distribution|Giza|Engineering Industries
CPC - # 205 (4)|Service Voltage Electricity Distribution|Giza|Other Services
سوبريمو للتصنيع والتجارة|Medium Voltage Electricity Distribution|Giza|Engineering Industries
CPC - # 201 (5)|Service Voltage Electricity Distribution|Giza|Other Services
بولى ماستر للبلاستيك|Medium Voltage Electricity Distribution|Giza|Engineering Industries
CPC - # 101 (6)|Service Voltage Electricity Distribution|Giza|Other Services
CPC - # 202 (7)|Service Voltage Electricity Distribution|Giza|Other Services
اكستروكوت 21 لسحب قطاعات الألومنيوم|Medium Voltage Electricity Distribution|Giza|Engineering Industries
CPC - # 203 b (8)|Service Voltage Electricity Distribution|Giza|Other Services
CPC - # 204 (10)|Service Voltage Electricity Distribution|Giza|Other Services
الفردوس لتصنيع وتعبئه المواد العذائيه (مكرونه بجميع أنواعها ) وطحن الغلال|Medium Voltage Electricity Distribution|Giza|Other Services
الكافتريا الدور الثاني سي بي سي|Service Voltage Electricity Distribution|Giza|Other Services
إنديجو مصر للمنسوجات|Medium Voltage Electricity Distribution|Giza|Textile & Spinning
اللوتس لصناعات الورق - نيو فيجن (تروتك للصناعات الهندسية والمعدنية سابقاً)|Medium Voltage Electricity Distribution|Giza|Other Services
بنك الإمارات|Service Voltage Electricity Distribution|Giza|Other Services
بلاست سرفيس جروب للتجارة والصناعة|Medium Voltage Electricity Distribution|Giza|Other Services
المبنى الإدارى|Service Voltage Electricity Distribution|Giza|Other Services
جلف باك للتعبئة والتغليف|Medium Voltage Electricity Distribution|Giza|Other Services
موندى كايرو لمواد التغليف (الوطنية للصناعات الورقية والإستيراد والتصدير سابقاً)|Medium Voltage Electricity Distribution|Giza|Other Industries
بروكتر وجامبل مصر|Medium Voltage Electricity Distribution|Giza|Other Industries
المصرية الكويتية للمسبوكات|Medium Voltage Electricity Distribution|Giza|Other Services
المنصور للسيارات|Medium Voltage Electricity Distribution|Giza|Engineering Industries
إيديتا للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
ناسيتا (الشركة الاهلية التجارية للاعمال الزراعية والصناعية والكيماوية)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
فارما اوفر سيز لتجارة وتوزيع الأدوية|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
الكوثر للمعادن|Medium Voltage Electricity Distribution|Giza|Iron & Steel
صن فارما إيجيبت ليميتد (رانباكسى إيجيبت ليميتد سابقاً)|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
أكسبرت للصناعات الهندسية (القوصى)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
الوليد للبلاستيك – محمد ممدوح جمال الدين وشركاه|Medium Voltage Electricity Distribution|Giza|Petrochemicals
المصرية لصناعة الورق (كينج بيبر)|Medium Voltage Electricity Distribution|Giza|Other Industries
الدولية للأعمال الهندسية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
المتكاملة للصناعات الحديثة|Medium Voltage Electricity Distribution|Giza|Other Services
جورج فارس ميخائيل مرقص - مركز الطحان لخدمة السيارات|Medium Voltage Electricity Distribution|Giza|Other Services
جاردينا لصناعة مواد التعبئه والتغليف|Medium Voltage Electricity Distribution|Giza|Other Services
جلوبال أدفانسد للأدوية|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
ميريتال للصناعات المعدنية|Medium Voltage Electricity Distribution|Giza|Iron & Steel
إيفا فارما للصناعات الدوائية - إيفا فارما (حورس للصناعات الدوائية سابقاً)|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
المصرية للصناعات الهندسية والمعدنية (أبناء سيد عبدالحفيظ)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
جراند لصناعة الأجهزة الكهربائية المنزلية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
القمم للإستثنمار الصناعى (شركة الواحة لخدمات الآبار والطلمبات سابقاً - زهرة الواحة سابقاً)|Medium Voltage Electricity Distribution|Giza|Other Services
سيريو بلاست إيجيبت|Medium Voltage Electricity Distribution|Giza|Petrochemicals
الكندية العربية للصناعات الورقية|Medium Voltage Electricity Distribution|Giza|Other Industries
الصفا للصناعات البلاستيكية (المصطفى بلاست سابقاً)|Medium Voltage Electricity Distribution|Giza|Other Services
الرواد للصناعات الكيماوية|Medium Voltage Electricity Distribution|Giza|Petrochemicals
مصانع عز العرب السويدي للسيارات (مودرن موتورز للصناعة سابقا-1000002536)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
الصلاح والهدى للصناعات والتخزين المبرد للمواد الغذائية والمعدنية|Medium Voltage Electricity Distribution|Giza|Other Services
جولدن أويل لإستخلاص وتكرير وتعبئة الزيوت النباتية (هانى محمود أحمد أبوالمجد وشركاه)|Medium Voltage Electricity Distribution|Giza|Other Services
ديتكو للهندسه والتجاره|Medium Voltage Electricity Distribution|Giza|Other Services
المنارة للمطاحن والصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
باعشن للصناعات الغذائية مصر|Medium Voltage Electricity Distribution|Giza|Food Industries
أبيكس للصناعات الغذائية (عادل عباس عبد الفتاح عنانى وشركاه)|Medium Voltage Electricity Distribution|Giza|Food Industries
العالميه لتجاره الجمله والتجزئه للأجهزه الكهربائيه والمنزليه ( المرشدي مول )|Medium Voltage Electricity Distribution|Giza|Engineering Industries
السراج للصناعات والتخزين المبرد للمواد الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
الرواد للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Other Services
أعطال لخدمة السيارات (رمضان محمد رمضان ابراهيم)|Medium Voltage Electricity Distribution|Giza|Other Services
هارفست فودز (بسكولاتة الحلبى للصناعات الغذائية سابقا - 1000002530)|Medium Voltage Electricity Distribution|Giza|Food Industries
المروة للاستيراد و التصدير|Medium Voltage Electricity Distribution|Giza|Other Services
الأولى للمطاحن والمواد الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
ميتشل جونيور مصر للملاحة والإستثمار|Medium Voltage Electricity Distribution|Giza|Other Services
سكيب للكيماويات|Medium Voltage Electricity Distribution|Giza|Other Services
كشك الخدمات رقم 2 الجزيرة|Service Voltage Electricity Distribution|Giza|Other Services
اليكس فاستنرز|Medium Voltage Electricity Distribution|Giza|Other Services
كشك خدمات الصناعات الصغيرة|Service Voltage Electricity Distribution|Giza|Other Services
اكس لارج للتعبئه والتغليف|Medium Voltage Electricity Distribution|Giza|Other Services
نيو دريم باك لصناعة الدوبلكس|Medium Voltage Electricity Distribution|Giza|Other Industries
العبد للأجهزه الكهربائيه|Medium Voltage Electricity Distribution|Giza|Engineering Industries
نيو برينت باك للكرتون المضلع|Medium Voltage Electricity Distribution|Giza|Other Industries
بيورال للصناعات الهندسيه وتشكيل المعادن|Medium Voltage Electricity Distribution|Giza|Engineering Industries
الإيمان للصناعات الكهربائية (إلياكو)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
المروه للتجاره و التوريدات و الطاقه المتجدده|Medium Voltage Electricity Distribution|Giza|Engineering Industries
طيبة للعطور|Medium Voltage Electricity Distribution|Giza|Other Services
أبل لصناعة مواد التعبئة والتغليف|Medium Voltage Electricity Distribution|Giza|Other Services
نيو لاين لتحويل الورق|Medium Voltage Electricity Distribution|Giza|Petrochemicals
تراى كيم لكيماويات البناء – خالد الوصيف رزق السيد شرف وشريكيه|Medium Voltage Electricity Distribution|Giza|Petrochemicals
المصرية لصناعة القفازات|Medium Voltage Electricity Distribution|Giza|Other Industries
شان فودز (دازل للصناعات الغذائية سابقاً)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
هاني فور تريد|Medium Voltage Electricity Distribution|Giza|Other Services
السلام لوجست|Medium Voltage Electricity Distribution|Giza|Other Services
حسنين سعيد حسنين عبد الكريم وشركاه (الياسمين للصناعات الغذائية)|Medium Voltage Electricity Distribution|Giza|Food Industries
الاولى للصناعات الحديثة|Medium Voltage Electricity Distribution|Giza|Other Services
بسام عطا علي محمد علي E01|Low Voltage Electricity Distribution|Giza|Food Industries
احمد طارق مصطفى (ميكاتك)|Low Voltage Electricity Distribution|Giza|Other Services
منشآة / محمد قطب عبد الفتاح قطب علي|Low Voltage Electricity Distribution|Giza|Other Services
فاليو للخدمات الكهروميكانيكيه|Low Voltage Electricity Distribution|Giza|Other Industries
سيد عبدالعاطى محمود محمد + محمد سيد عبدالعاطى محمود|Low Voltage Electricity Distribution|Giza|Other Services
المجموعة الهندسية المتحدة (هشام وشريف عرفة)|Low Voltage Electricity Distribution|Giza|Other Industries
محمد عبد المنعم عطا محمد عطا|Low Voltage Electricity Distribution|Giza|Other Services
مؤسسة فودز للتوريدات|Low Voltage Electricity Distribution|Giza|Other Services
ياسر نبيل عبد الحميد عبد الرحمن + أمل محمد أحمد مصطفي البرادعي|Low Voltage Electricity Distribution|Giza|Other Services
كى تو ستيل|Low Voltage Electricity Distribution|Giza|Other Services
العربية للتوريدات العموميه والإستيراد والتصدير|Low Voltage Electricity Distribution|Giza|Other Services
تكنوتريد|Low Voltage Electricity Distribution|Giza|Petrochemicals
فينيكس للتسويق F04|Low Voltage Electricity Distribution|Giza|Other Services
فينيكس للتسويق F05|Low Voltage Electricity Distribution|Giza|Other Services
النجمه لتشغيل المعادن|Low Voltage Electricity Distribution|Giza|Other Services
فاست ميديكال للصناعات الطبيه والمطهرات|Low Voltage Electricity Distribution|Giza|Other Services
محمد صادق عبد الحميد محمود|Low Voltage Electricity Distribution|Giza|Other Services
نصير لقطع غيار السيارات|Low Voltage Electricity Distribution|Giza|Other Services
نصير للتوريدات الحكوميه|Low Voltage Electricity Distribution|Giza|Other Industries
لبنى مسلم محمود متولي F13(مركز امداد للمواجد الخام)|Low Voltage Electricity Distribution|Giza|Other Services
لبنى مسلم محمود متولي F14|Low Voltage Electricity Distribution|Giza|Other Industries
بي سيفتي لمعدات الإطفاء ومهمات الأمن الصناعي|Low Voltage Electricity Distribution|Giza|Other Industries
Kiosk B|Low Voltage Electricity Distribution|Giza|Other Services
محمود محمد السيد السيد|Low Voltage Electricity Distribution|Giza|Other Industries
كونرينت للإستثمار العقارى|Low Voltage Electricity Distribution|Giza|Other Services
فوتو اكسبريس مصر|Low Voltage Electricity Distribution|Giza|Other Services
جو باك لصناعة مواد التعبئه والتغليف|Low Voltage Electricity Distribution|Giza|Food Industries
باور سوليوشنز G09|Low Voltage Electricity Distribution|Giza|Other Services
حسناء حساني فتحي احمد G10|Low Voltage Electricity Distribution|Giza|Other Services
بلال حسين احمد محمود G11|Low Voltage Electricity Distribution|Giza|Other Services
السلام الدولية للتنمية والاستثمار الزراعى|Low Voltage Electricity Distribution|Giza|Fertilizers
وي جرو جرين|Low Voltage Electricity Distribution|Giza|Fertilizers
احمد اسعد محمد عبد اللطيف|Low Voltage Electricity Distribution|Giza|Other Services
تراك انترناشيونال تريد H03|Low Voltage Electricity Distribution|Giza|Other Services
ايمن محمود محمود حسين احمد H04|Low Voltage Electricity Distribution|Giza|Other Services
ولفارم للصيدلة|Low Voltage Electricity Distribution|Giza|Pharmaceuticals
السيد / العزي ناجي حسن الحرازي|Low Voltage Electricity Distribution|Giza|Other Services
اولتك الهندسية مصر H08|Low Voltage Electricity Distribution|Giza|Other Services
السما العربى لإستيراد قطع غيار الموتوسيكلات (محمد إسماعيل سيد)|Low Voltage Electricity Distribution|Giza|Other Services
محمد مصطفي عبد السميع مصطفي H10|Low Voltage Electricity Distribution|Giza|Other Industries
كاربون ستيل للتصميمات الهندسيه|Low Voltage Electricity Distribution|Giza|Iron & Steel
مصر اوربا للمشروعات السياحيه|Low Voltage Electricity Distribution|Giza|Other Services
بروساينز للدعايه والاعلان H13|Low Voltage Electricity Distribution|Giza|Other Industries
محمد عبدالله محمد عبد العاطي + أحمد عبدالله محمد عبد العاطي|Low Voltage Electricity Distribution|Giza|Other Services
مصر للاستيراد والمقاولات H15/S19|Low Voltage Electricity Distribution|Giza|Other Services
Kiosk A|Low Voltage Electricity Distribution|Giza|Other Services
TR-1|Medium Voltage Electricity Distribution|Giza|Other Services
TR-2|Medium Voltage Electricity Distribution|Giza|Other Services
TR-4|Medium Voltage Electricity Distribution|Giza|Other Services
TR-6|Medium Voltage Electricity Distribution|Giza|Other Services
كشك قطعة P13|Medium Voltage Electricity Distribution|Giza|Other Services
كازان للمنظفات ومستحضرات التجميل (المصرية للصناعات المغذية للسيارات سابقاً)|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
ايبيس فارما|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
مؤسسة مصر الخليج للصناعات الهندسية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
سمايل جروب لتجارة وبيع وتصنيع الملابس الجاهزه|Medium Voltage Electricity Distribution|Giza|Textile & Spinning
بي تو باك لصناعة الكرتون - عادل وهبه خليفه وهبه|Medium Voltage Electricity Distribution|Giza|Other Industries
زيوس للاضاءة الحديثه|Medium Voltage Electricity Distribution|Giza|Engineering Industries
المصرية الالمانية للصناعات الانشائية|Medium Voltage Electricity Distribution|Giza|Other Industries
ويل مانيفكتشرينج إيجيبت للمنظفات والشامبو|Medium Voltage Electricity Distribution|Giza|Engineering Industries
صبحي أحمد محمد نجم|Medium Voltage Electricity Distribution|Giza|Other Services
ناصف وجدى محمد متولى مباشر وشريكيه - ناسكوم|Medium Voltage Electricity Distribution|Giza|Other Industries
القادسية لصناعة مواد التعبئة والتغليف|Medium Voltage Electricity Distribution|Giza|Other Services
راية للتصنيع المتطور (المصرية الدولية للتجارة (هبة الشافعى) - سابقاً)|Medium Voltage Electricity Distribution|Giza|Engineering Industries
أوفو ايجيبت لمنتجات البيض|Medium Voltage Electricity Distribution|Giza|Other Industries
هوتاماكى فليكسبل باكاجينج إيجيبت|Medium Voltage Electricity Distribution|Giza|Other Services
ألوميل مصر للتجارة|Medium Voltage Electricity Distribution|Giza|Engineering Industries
دوترا للكيماويات - بساتين الدبلوماسيين للتوكيلات التجارية وشريكيها|Medium Voltage Electricity Distribution|Giza|Other Industries
الهندسية للصناعات والتشييد|Medium Voltage Electricity Distribution|Giza|Engineering Industries
مصنع جولدن بايب لصناعة المواسير البلاستيك - خالد جادو وشريكه|Medium Voltage Electricity Distribution|Giza|Petrochemicals
لوجسيتيكا للخدمات اللوجيستية|Medium Voltage Electricity Distribution|Giza|Other Services
هنكل مصر للصناعة والتجارة|Medium Voltage Electricity Distribution|Giza|Other Services
جى تك للصناعات المغذية|Medium Voltage Electricity Distribution|Giza|Food Industries
الخليجية للتصنيع (رواسى)|Medium Voltage Electricity Distribution|Giza|Petrochemicals
نيبون لوجستيك|Medium Voltage Electricity Distribution|Giza|Other Services
شلمبرجير لوجيكو إنك|Medium Voltage Electricity Distribution|Giza|Other Industries
المصرية الأوربية للإستيراد والتصدير والتوكيلات التجارية|Medium Voltage Electricity Distribution|Giza|Other Services
إبن سينا فارما|Medium Voltage Electricity Distribution|Giza|Pharmaceuticals
غرفة TR 1|Medium Voltage Electricity Distribution|Giza|Other Services
غرفة TR 2|Medium Voltage Electricity Distribution|Giza|Other Services
كشك البوصلة 1|Medium Voltage Electricity Distribution|Giza|Other Services
كشك البوصلة 2|Medium Voltage Electricity Distribution|Giza|Other Services
كشك البوصلة 3|Medium Voltage Electricity Distribution|Giza|Other Services
فوم هاوس - حازم رفعت وشركاه|Medium Voltage Electricity Distribution|Giza|Other Services
هيات إيجيبت للمنتجات الصحية(هياة كيميا ايجيبت|Medium Voltage Electricity Distribution|Giza|Other Industries
باكمان لصناعات وحلول الطباعة والتغليف|Medium Voltage Electricity Distribution|Giza|Other Industries
بيم ستورز|Medium Voltage Electricity Distribution|Giza|Other Services
المتحدة للتجارة والتوزيع للسلع الإستهلاكية|Medium Voltage Electricity Distribution|Giza|Engineering Industries
جولسان إيجيبت للصناعات غير المنسوجة|Medium Voltage Electricity Distribution|Giza|Textile & Spinning
جورج سمير صبرى و شريكتة|Low Voltage Electricity Distribution|Giza|Other Services
هاي تك لخدمة وسائل النقل|Low Voltage Electricity Distribution|Giza|Engineering Industries
خالد جروب للصيانه والتوكيلات التجاريه|Low Voltage Electricity Distribution|Giza|Other Services
فورميلا للصناعات الكهربائيه|Low Voltage Electricity Distribution|Giza|Engineering Industries
بيج داتا ايجيبت للانظمه|Low Voltage Electricity Distribution|Giza|Other Services
محمد اسماعيل ابراهيم عيداروس|Low Voltage Electricity Distribution|Giza|Other Services
أجرو النيل للتنمية الصناعية|Low Voltage Electricity Distribution|Giza|Other Industries
عثمان افرين اريكان|Low Voltage Electricity Distribution|Giza|Other Services
أحمد عبدالحميد أحمد محمد رمضان / سيد عبدالحميد ابراهيم سيف الدين / رفيق سعد أنطون باسيلى|Low Voltage Electricity Distribution|Giza|Other Services
أويلكو|Low Voltage Electricity Distribution|Giza|Other Services
أحمد عبدالحميد أحمد محمد رمضان / سيد عبدالحميد ابراهيم سيف الدين|Low Voltage Electricity Distribution|Giza|Other Services
تجفيف للتصنيع الغذائى|Low Voltage Electricity Distribution|Giza|Food Industries
الهندسية للصناعات والتشييد (سياك) C11|Low Voltage Electricity Distribution|Giza|Engineering Industries
الهندسية للصناعات والتشييد (سياك) C13|Low Voltage Electricity Distribution|Giza|Engineering Industries
أم أى سفن للدعاية و الاعلان|Low Voltage Electricity Distribution|Giza|Other Services
فيرست كب للصناعات الورقية و البلاستيكية|Low Voltage Electricity Distribution|Giza|Other Industries
السيف لاستيراد خامات البلاستيك|Low Voltage Electricity Distribution|Giza|Other Services
ماف جروب الصناعية|Low Voltage Electricity Distribution|Giza|Other Services
ديجيتك (مجدى إسماعيل دياب)|Low Voltage Electricity Distribution|Giza|Other Services
عثمان افرين اريكان (أيكون لصناعة مواد البناء سابقا) (الدولية للمشروعات والإستثمار سابقاً 1000015256)|Low Voltage Electricity Distribution|Giza|Other Services
علاء الدين لطفى وشركاه (اما لهندسة الهيدروماتيك)|Low Voltage Electricity Distribution|Giza|Other Industries
المركز الدولى للتجارة والأمن الصناعى (جمال عبد الدايم سليمان)|Low Voltage Electricity Distribution|Giza|Other Services
بيج داتا ايجيبت للأنظمة|Low Voltage Electricity Distribution|Giza|Other Services
مالتي تراك للمولات التجاريه|Low Voltage Electricity Distribution|Giza|Other Services
نعمان الهندسية|Low Voltage Electricity Distribution|Giza|Engineering Industries
أحمد محمد على حسن / فريدة محمد على حسن / ياسمين محمد على حسن / هبه مطاوع محمد مطاوع|Low Voltage Electricity Distribution|Giza|Other Services
كونسوقرة للتوكيلات التجارية والإستشارات الفنية|Low Voltage Electricity Distribution|Giza|Other Services
حسن على حسن|Low Voltage Electricity Distribution|Giza|Engineering Industries
الدلتا للكيماويات (يحيى العبد وشركاه)|Low Voltage Electricity Distribution|Giza|Other Services
المحمودية للصناعات الغذائية المعدنية والبلاستيكية|Low Voltage Electricity Distribution|Giza|Other Services
عادل عبدالجواد محمد فايد-تم التنازل عنها لنيكسيس الشرق للتجارة|Low Voltage Electricity Distribution|Giza|Other Services
الكريم للتجاره والتوزيع|Low Voltage Electricity Distribution|Giza|Other Services
المركز الدولي للتجاره|Low Voltage Electricity Distribution|Giza|Other Services
الهولندية للأيس كريم (أحمد مدحت خليل وشريكته)|Low Voltage Electricity Distribution|Giza|Other Industries
الدولية للكيماويات اى كيم|Low Voltage Electricity Distribution|Giza|Other Industries
مشرق لتنمية الأعمال|Low Voltage Electricity Distribution|Giza|Other Services
فينيكس للتسويق|Low Voltage Electricity Distribution|Giza|Other Services
احمد عبد الرحيم احمد عبد الرحمن|Low Voltage Electricity Distribution|Giza|Other Services
ماجد طوسون محمد عوض|Low Voltage Electricity Distribution|Giza|Other Services
ميدل ايست للحلول الكهربائيه|Low Voltage Electricity Distribution|Giza|Engineering Industries
الدلتا للكيماويات|Low Voltage Electricity Distribution|Giza|Petrochemicals
الامين اوتو سيرفيس|Low Voltage Electricity Distribution|Giza|Other Services
الصوالحي للاجهزه المنزليه والكهربائيه|Low Voltage Electricity Distribution|Giza|Other Industries
نماء المتحدة للتجارة والتوزيع|Low Voltage Electricity Distribution|Giza|Other Industries
مؤسسة الاسراء للأدوات الكهربائيه|Low Voltage Electricity Distribution|Giza|Other Services
بي هايف|Low Voltage Electricity Distribution|Giza|Other Services
ويليز كيتشن للماكولات السريعه|Low Voltage Electricity Distribution|Giza|Food Industries
عدلي احمد ماهر-هدى رشيد حدرج|Low Voltage Electricity Distribution|Giza|Other Services
توهيدروليكس|Low Voltage Electricity Distribution|Giza|Other Services
محمد عادل صلاح البنداري سعد|Low Voltage Electricity Distribution|Giza|Other Services
احمد صلاح عبد الفتاح محمد|Low Voltage Electricity Distribution|Giza|Other Industries
علاء الدين يونان ميخائيل|Low Voltage Electricity Distribution|Giza|Other Services
محمد محمد احمد عثمان|Low Voltage Electricity Distribution|Giza|Other Services
الشركه المصريه للصنفره|Low Voltage Electricity Distribution|Giza|Other Services
احمد عثمان وهبه عثمان|Low Voltage Electricity Distribution|Giza|Other Services
محمود صالح محمد احمد|Low Voltage Electricity Distribution|Giza|Other Services
العز لتجارة الحاصلات الزراعيه والدقيق|Low Voltage Electricity Distribution|Giza|Other Services
كريم ابراهيم فخري عبد النور|Low Voltage Electricity Distribution|Giza|Other Services
يونايتد فارما|Low Voltage Electricity Distribution|Giza|Other Services
بدوي اسماعيل صالح حسين|Low Voltage Electricity Distribution|Giza|Other Services
مينا مجدي فريد مينا|Low Voltage Electricity Distribution|Giza|Other Services
حسن يسري حسن عبد الحافظ|Low Voltage Electricity Distribution|Giza|Other Services
عبد الله نوري وكاع|Low Voltage Electricity Distribution|Giza|Other Services
احمد اسماعيل حنفي الخواص|Low Voltage Electricity Distribution|Giza|Other Services
محمد مصطفي عبد السميع مصطفى|Low Voltage Electricity Distribution|Giza|Other Services
شواي كي|Low Voltage Electricity Distribution|Giza|Other Services
كويك كارجو|Low Voltage Electricity Distribution|Giza|Other Services
الجذور للتجارة والاستثمارات الزراعية|Low Voltage Electricity Distribution|Giza|Petrochemicals
الصفوه|Low Voltage Electricity Distribution|Giza|Other Services
سمير عبدالباسط محروس وشركائه|Low Voltage Electricity Distribution|Giza|Other Services
احمد نشات محمد لطفي القاضي|Low Voltage Electricity Distribution|Giza|Other Services
المركز المصري لصيانة السيارات|Low Voltage Electricity Distribution|Giza|Other Services
اسلام عنتر محمد وشريكه|Low Voltage Electricity Distribution|Giza|Other Services
المركز العربي الافريقي للتجاره|Low Voltage Electricity Distribution|Giza|Other Services
مينا كيرلس ميشيل يوسف|Low Voltage Electricity Distribution|Giza|Other Services
الشركة العربيه للصناعات والتوكيلات التجاريه|Low Voltage Electricity Distribution|Giza|Other Services
حسن اسماعيل حسن الهضيبي|Low Voltage Electricity Distribution|Giza|Other Services
اكسبريس لوجستيكس|Low Voltage Electricity Distribution|Giza|Other Services
شريف نبيل صالح الكابلي|Low Voltage Electricity Distribution|Giza|Other Services
السعيده رتيل لتصنيع وتعبئة وتخزين المواد الغذائيه|Low Voltage Electricity Distribution|Giza|Other Services
ايمن زكريا-هشام صبحي|Low Voltage Electricity Distribution|Giza|Other Services
بيت الكهرباء للتجاره الدوليه|Low Voltage Electricity Distribution|Giza|Other Services
اسماعيل محمد عوف عبد الرحمن|Low Voltage Electricity Distribution|Giza|Other Services
الالمانيه لكيماويات البناء الحديث|Low Voltage Electricity Distribution|Giza|Other Services
دوت للصناعات الانشائيه|Low Voltage Electricity Distribution|Giza|Other Services
مصطفي جمال الدين حسن شرف|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى I|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى J|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى K|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى L|Low Voltage Electricity Distribution|Giza|Other Services
العثمان جروب|Low Voltage Electricity Distribution|Giza|Other Services
محمد خالد احمد خالد|Low Voltage Electricity Distribution|Giza|Food Industries
العطايا للصناعات الهندسية والتوريدات|Low Voltage Electricity Distribution|Giza|Engineering Industries
النصر للإستيراد والتصدير|Low Voltage Electricity Distribution|Giza|Other Industries
المتحده للتجارة-يونايتد تريدنج كومباني|Low Voltage Electricity Distribution|Giza|Other Services
تهاني فتحي احمد نمر|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى M|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى N|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى O|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى P|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى R|Low Voltage Electricity Distribution|Giza|Other Services
كشك مبنى S|Low Voltage Electricity Distribution|Giza|Other Services
ريسيبي لتصنيع خلطات التوابل|Low Voltage Electricity Distribution|Giza|Other Services
اوغريت للاستيراد والتصدير|Low Voltage Electricity Distribution|Giza|Other Services
نيكسيس الشرق للتامين|Low Voltage Electricity Distribution|Giza|Other Services
ايمن سعد احمد شلبي محمد|Low Voltage Electricity Distribution|Giza|Other Services
احمد مصطفي سيد احمد|Low Voltage Electricity Distribution|Giza|Other Services
جودي احمد عمرو خيري محمد القاضي|Low Voltage Electricity Distribution|Giza|Other Services
ايهاب غندور احمد الشرقاوي|Low Voltage Electricity Distribution|Giza|Other Services
احمد ماهر عبد المجيد|Low Voltage Electricity Distribution|Giza|Other Services
ايمن محمود محمود حسين|Low Voltage Electricity Distribution|Giza|Other Services
نورا السيد علي علواني|Low Voltage Electricity Distribution|Giza|Other Services
مصطفي عاشور عبد الفتاح|Low Voltage Electricity Distribution|Giza|Other Services
عمرو صلاح -أحمد صلاح-خالد عبد الرحيم|Low Voltage Electricity Distribution|Giza|Other Services
عبد الله عبد الرحمن احمد|Low Voltage Electricity Distribution|Giza|Other Services
ياسر عبد الله محمود-نجوي ابراهيم محمود|Low Voltage Electricity Distribution|Giza|Other Services
الفتح للاقمشة|Low Voltage Electricity Distribution|Giza|Other Services
القدس للتجارة والصناعة|Low Voltage Electricity Distribution|Giza|Other Services
محمد احمد-ياسر محمد-ياسر احمد|Low Voltage Electricity Distribution|Giza|Engineering Industries
النجمة لتشغيل المعادن|Low Voltage Electricity Distribution|Giza|Other Services
اكديما انترناشيونال (مينا بطرس ق5 سابقا1000002397)|Low Voltage Electricity Distribution|Giza|Pharmaceuticals
طاقة للأسلاك الكهربائية 39|Low Voltage Electricity Distribution|Giza|Engineering Industries
هاى ستيل A01|Low Voltage Electricity Distribution|Giza|Iron & Steel
الصناعات الصغيرة|Low Voltage Electricity Distribution|Giza|Other Services
الصناعات الصغيرة الجديدة 2|Low Voltage Electricity Distribution|Giza|Other Services
عداد كشرى التحرير|Service Voltage Electricity Distribution|Giza|Other Services
أهلا بلاس 10|Service Voltage Electricity Distribution|Giza|Other Services
شركة تضامن مكتب 404|Service Voltage Electricity Distribution|Giza|Other Services
أحمد منصور فهمى أحمد طه J14|Low Voltage Electricity Distribution|Giza|Other Services
المركز المصرى لصيانة السيارات K22|Low Voltage Electricity Distribution|Giza|Other Services
مصطفى جمال الدين حسن L22|Low Voltage Electricity Distribution|Giza|Other Services
شركة المتحدة للصيادلة (جلوبال نابي)|Medium Voltage Electricity Distribution|Giza|Other Services
فانسى فودز للصناعات الغذائية|Medium Voltage Electricity Distribution|Giza|Food Industries
عداد خدمات ق Z27 - سام كريت|Medium Voltage Electricity Distribution|Giza|Other Services
غرفة مجمع الورش|Service Voltage Electricity Distribution|Giza|Other Services
عداد الملاعب|Service Voltage Electricity Distribution|Giza|Other Services
عداد خدمات موزع الأولى رقم 1|Service Voltage Electricity Distribution|Giza|Other Services
غرفة خدمات محطة الرفع|Service Voltage Electricity Distribution|Giza|Other Services
سيميتار إيجيبت للإنتاج المحدودة|Power Generation|Red Sea|Engineering Industries
أورا_سيلفر ساندز|O&M Contract|Matrouh|Residential Complex
دولفينا|Medium Voltage Electricity Distribution|South Sinai|Hotels
دولفينا|Solar Power Plant|South Sinai|Hotels
نخيل|Low Voltage Electricity Distribution|Cairo|Residential Complex
فطيم|Low Voltage Electricity Distribution|Cairo|Shopping Center
مول أوف أرابيا|Low Voltage Electricity Distribution|Giza|Shopping Center
مول أوف أرابيا|O&M Contract|Giza|Shopping Center`;

const SERVICE_RENAME: Record<string, string> = {
  "Medium Voltage Electricity Distribution": "MV Distribution",
  "Low Voltage Electricity Distribution": "LV Distribution",
  "Service Voltage Electricity Distribution": "LV Distribution",
  "O&M Contract": "O&M",
};

export const electricityData: ClientRecord[] = parseRecords(raw).map(r => ({
  ...r,
  service: SERVICE_RENAME[r.service ?? ""] ?? r.service,
}));
