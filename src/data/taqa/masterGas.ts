import { parseRecords, ClientRecord } from './types';

const raw = `برايكا ريزورت|Mobile CNG Units|Red Sea|Hotels
ترافكو (فنادق)|Mobile CNG Units|Red Sea|Hotels
جاز جراند مرسة|Mobile CNG Units|Red Sea|Hotels
سمايل بوتيتوز|Mobile CNG Units|New Valley|Food Industries
كايرو 3A|Mobile CNG Units|Beheira|Food Industries
منتجع بيك الباتروس بورتفينو|Mobile CNG Units|Red Sea|Hotels
منتجع بيك الباتروس بورتو غالب|Mobile CNG Units|Red Sea|Hotels
منتجع بيك الباتروس سي وورلد|Mobile CNG Units|Red Sea|Hotels
منتجع جاز دهبية|Mobile CNG Units|South Sinai|Hotels
ميديكال فرنس|Mobile CNG Units|Asyut|Other Industries
محطة الكوبة|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة الوراق|CNG Vehicle Distribution|Giza|Natural Gas Products
محطة السودان|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة السويس|CNG Vehicle Distribution|Suez|Natural Gas Products
محطة السويس 2|CNG Vehicle Distribution|Suez|Natural Gas Products
محطة الإسكندرية|CNG Vehicle Distribution|Alexandria|Natural Gas Products
محطة كفر الشيخ|CNG Vehicle Distribution|Kafr El Sheikh|Natural Gas Products
محطة الغردقة|CNG Vehicle Distribution|Red Sea|Natural Gas Products
محطة الغردقة 2|CNG Vehicle Distribution|Red Sea|Natural Gas Products
محطة تشيل أوت_أكتوبر_فودافون|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت_الرحاب|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت_الرحاب 2|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة المنيا|CNG Vehicle Distribution|Minya|Natural Gas Products
محطة جديدة(أسيوط)|CNG Vehicle Distribution|Asyut|Natural Gas Products
محطة جديدة(بني سويف)|CNG Vehicle Distribution|Beni Suef|Natural Gas Products
محطة جديدة(كفر الشيخ 2)|CNG Vehicle Distribution|Kafr El Sheikh|Natural Gas Products
محطة جديدة(الإسماعيلية)|CNG Vehicle Distribution|Ismailia|Natural Gas Products
محطة تشيل أوت(30 يونيو)|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت(المشير)|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت(السلام)|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت(السلام)_2|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت(مستورد)|CNG Vehicle Distribution|Qalyubia|Natural Gas Products
محطة مستورد 2|CNG Vehicle Distribution|Qalyubia|Natural Gas Products
محطة تشيل أوت(النوبارية)|CNG Vehicle Distribution|Beheira|Natural Gas Products
محطة المقر الرئيسي بالقاهرة_المخازن-التوريد|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت(العبور)|CNG Vehicle Distribution|Qalyubia|Natural Gas Products
محطة دسوق|CNG Vehicle Distribution|Kafr El Sheikh|Natural Gas Products
محطة العبور 2|CNG Vehicle Distribution|Qalyubia|Natural Gas Products
محطة إمداد_تموين|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة الوادي الجديد|CNG Vehicle Distribution|New Valley|Natural Gas Products
محطة حصري|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة الغردقة_3|CNG Vehicle Distribution|Red Sea|Natural Gas Products
محطة تشيل أوت أوتوسطي-الشروق|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت طريق الفرارغ|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة طاقة_ببا|CNG Vehicle Distribution|Beni Suef|Natural Gas Products
محطة تشيل أوت محمد نجيب|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت المحمودية 2|CNG Vehicle Distribution|Alexandria|Natural Gas Products
محطة تشيل أوت المحمودية 1|CNG Vehicle Distribution|Alexandria|Natural Gas Products
محطة منوف|CNG Vehicle Distribution|Monufia|Natural Gas Products
محطة تشيل أوت فردوس 1|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت فردوس 2|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت الجامعة الأمريكية|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة المنيا 2|CNG Vehicle Distribution|Minya|Natural Gas Products
محطة تشيل أوت_محمد زكي|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت_المنصورة|CNG Vehicle Distribution|Dakahlia|Natural Gas Products
محطة تشيل أوت_المشير 3|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة عين شمس|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة طنطا لوجستيك|CNG Vehicle Distribution|Gharbia|Natural Gas Products
محطة الإسماعيلية-قناة السويس|CNG Vehicle Distribution|Ismailia|Natural Gas Products
محطة تشيل أوت_شبين|CNG Vehicle Distribution|Monufia|Natural Gas Products
محطة مغاغة|CNG Vehicle Distribution|Minya|Natural Gas Products
محطة بدر طاقة|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة الفيوم|CNG Vehicle Distribution|Fayoum|Natural Gas Products
محطة تشيل أوت_شينزو أبي 1|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة باجور طاقة|CNG Vehicle Distribution|Monufia|Natural Gas Products
محطة تشيل أوت_أسيوط هويس|CNG Vehicle Distribution|Asyut|Natural Gas Products
محطة أسيوط_2 بندر1|CNG Vehicle Distribution|Asyut|Natural Gas Products
محطة تشيل أوت_أسيوط هويس 2|CNG Vehicle Distribution|Asyut|Natural Gas Products
محطة العين السخنة طاقة|CNG Vehicle Distribution|Suez|Natural Gas Products
محطة تشيل أوت_الكفراوي|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة بني سويف-طوون2|CNG Vehicle Distribution|Beni Suef|Natural Gas Products
محطة تشيل أوت-محمد زكي2|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت-القباري|CNG Vehicle Distribution|Alexandria|Natural Gas Products
محطة تشيل أوت-شينزو أبي 2|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت_بهتيم مستورد 3|CNG Vehicle Distribution|Qalyubia|Natural Gas Products
محطة تشيل أوت_بهتيم 2|CNG Vehicle Distribution|Qalyubia|Natural Gas Products
محطة 15 مايو-طاقة|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة العاشر من رمضان|CNG Vehicle Distribution|Sharqia|Natural Gas Products
محطة العاشر من رمضان_2|CNG Vehicle Distribution|Sharqia|Natural Gas Products
محطة الخارجة_2|CNG Vehicle Distribution|New Valley|Natural Gas Products
محطة دسوق المواقف_أفراد|CNG Vehicle Distribution|Kafr El Sheikh|Natural Gas Products
محطة تشيل أوت_شرم الشيخ|CNG Vehicle Distribution|South Sinai|Natural Gas Products
محطة تشيل أوت_وفاء وأمل|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت_طنطا جيش|CNG Vehicle Distribution|Gharbia|Natural Gas Products
محطة تشيل أوت حديقة الأهرام|CNG Vehicle Distribution|Giza|Natural Gas Products
محطة تشيل أوت حديقة الأهرام-2|CNG Vehicle Distribution|Giza|Natural Gas Products
محطة زقازيق_السيدناوي|CNG Vehicle Distribution|Sharqia|Natural Gas Products
محطة طريق الفرارغ 2|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة وراق 2|CNG Vehicle Distribution|Giza|Natural Gas Products
محطة قليوب|CNG Vehicle Distribution|Qalyubia|Natural Gas Products
محطة تشيل أوت_عدلي منصور|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت_كفر الشيخ 3|CNG Vehicle Distribution|Kafr El Sheikh|Natural Gas Products
محطة تشيل أوت_الكفراوي 2|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت أثر النبي|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت عدلي منصور 2|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت_الإسماعيلية قرش|CNG Vehicle Distribution|Ismailia|Natural Gas Products
محطة تشيل أوت_الحي العاشر مدينة نصر|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة تشيل أوت_طنطا 3|CNG Vehicle Distribution|Gharbia|Natural Gas Products
محطة مؤسسة زكاة|CNG Vehicle Distribution|Cairo|Natural Gas Products
محطة زعفرانة|CNG Vehicle Distribution|Red Sea|Natural Gas Products`;

export const masterGasData: ClientRecord[] = parseRecords(raw);

export const mobileCNGData = masterGasData.filter(r => r.service === "Mobile CNG Units");
export const cngStationsData = masterGasData.filter(r => r.service === "CNG Vehicle Distribution");
