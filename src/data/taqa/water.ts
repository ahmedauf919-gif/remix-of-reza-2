import { parseRecords, ClientRecord } from './types';

const raw = `بالم هيلز القاهرة الجديدة|Cairo|Residential Complex
مجمع جون|Matrouh|Residential Complex
منتجع تاور باي|Port Said|Hotels
منتجع ريكسوس راداميس|South Sinai|Hotels
منتجع زهرة|Matrouh|Residential Complex
منتجع فوكا باي|Matrouh|Hotels
منتجع سوما باي|Red Sea|Residential Complex
منتجع لا فيستا باي|Matrouh|Residential Complex
منتجع لافيستا راس الحكمة|Matrouh|Residential Complex
منتجع ماونتن فيو رأس الحكمة|Matrouh|Hotels
منتجع مكادي هايتس|Red Sea|Hotels
منتجع بيك الباتروس اكوا بارك|South Sinai|Hotels
قرية ريكسوس مجاويش|Red Sea|Hotels
أورا_سيلفر ساندز|Matrouh|Residential Complex`;

export const waterData: ClientRecord[] = parseRecords(raw, "Water Desalination Units");
