import { parseRecords, ClientRecord } from './types';

const raw = `محظة شبراخيت|Beheira|Petroleum Products
محظة نخيلا|Asyut|Petroleum Products
محظة مينا الكامح|Sharqia|Petroleum Products
محظة وادي الملك|Ismailia|Petroleum Products
محظة بلطيم|Kafr El Sheikh|Petroleum Products
محظة كفر الشيخ|Kafr El Sheikh|Petroleum Products
محظة ديروط|Asyut|Petroleum Products
محظة الطريق الدائري|Qalyubia|Petroleum Products
محظة أبو حمص|Beheira|Petroleum Products
محظة تبن|Cairo|Petroleum Products
محظة القنطرة|Ismailia|Petroleum Products
محظة القومية|Giza|Petroleum Products
محظة قليوب|Qalyubia|Petroleum Products
محظة ببا|Beni Suef|Petroleum Products
محظة المنيا 1|Minya|Petroleum Products
محظة دمنهور|Beheira|Petroleum Products
محظة المنصورة|Dakahlia|Petroleum Products
محظة الطريق الإقليمي|Beheira|Petroleum Products
محظة مارينا|Matrouh|Petroleum Products
محظة برج العرب|Alexandria|Petroleum Products
محظة برجت|Beheira|Petroleum Products
محظة المريوطية|Giza|Petroleum Products
محظة العاشر من رمضان|Sharqia|Petroleum Products
محظة وراق|Giza|Petroleum Products
محظة إسماعيلية / القاهرة (المنايف)|Ismailia|Petroleum Products
محظة 15 مايو|Cairo|Petroleum Products
محظة براموس|Beheira|Petroleum Products
محظة بركة السبع|Monufia|Petroleum Products
محظة الأوتوستراد|Cairo|Petroleum Products
محظة المنيا 2|Minya|Petroleum Products
محظة النهضة|Giza|Petroleum Products
محظة إيزي سبورت|Cairo|Petroleum Products
محظة الهضبة الوسطى|Cairo|Petroleum Products
محظة التوفيقية|Beheira|Petroleum Products
محظة بدراشين|Giza|Petroleum Products
محظة كفر بدوي|Dakahlia|Petroleum Products
محظة الحامول|Kafr El Sheikh|Petroleum Products
محظة الرحمة|Gharbia|Petroleum Products
محظة المثلث|Kafr El Sheikh|Petroleum Products
محظة مدينة نصر|Cairo|Petroleum Products
محظة سمالوط|Minya|Petroleum Products
محظة المقطم|Cairo|Petroleum Products
محظة 6 أكتوبر (غرب سوميد)|Giza|Petroleum Products
محظة كوم حمادة|Beheira|Petroleum Products
محظة مغاغة|Minya|Petroleum Products
محظة العين السخنة|Suez|Petroleum Products
محظة الواسطى|Beni Suef|Petroleum Products
محظة حوش عيسى|Beheira|Petroleum Products
محظة دفرة|Gharbia|Petroleum Products
محظة أوتو فالي|Giza|Petroleum Products
محظة الشيخ فضل|Red Sea|Petroleum Products
محظة دمياط الجديدة|Damietta|Petroleum Products
محظة مدينة المنيا الجديدة|Minya|Petroleum Products
محظة طنطا (كارفور)|Gharbia|Petroleum Products
محظة الكوالا|Sohag|Petroleum Products
محظة مدينة الإسماعيلية|Ismailia|Petroleum Products
محظة أبو صير الملق|Beni Suef|Petroleum Products
محظة سهل حشيش|Red Sea|Petroleum Products
محظة أهناسيا|Beni Suef|Petroleum Products
محظة رفد بلطيم|Kafr El Sheikh|Petroleum Products
محظة النوبارية|Beheira|Petroleum Products
محظة الطريق الدائري بالفيوم|Fayoum|Petroleum Products
محظة مدينة بدر|Cairo|Petroleum Products
محظة الباجور|Monufia|Petroleum Products
محظة الزقازيق|Sharqia|Petroleum Products
محظة فاقوس|Sharqia|Petroleum Products
محظة شبرا الخيمة|Cairo|Petroleum Products
محظة هيئة قناة السويس|Ismailia|Petroleum Products
محظة الطريق الدائري سمالوط|Minya|Petroleum Products
محظة النرجس1|Cairo|Petroleum Products
محظة النرجس2|Cairo|Petroleum Products`;

export const petroleumData: ClientRecord[] = parseRecords(raw, "Petroleum Products Distribution");
