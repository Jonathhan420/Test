export interface Inventory {
  assets: Asset[];
  descriptions: InventoryDescription[];
  total_inventory_count: number;
  success: number;
  rwgrsn: number;
}

export interface Asset {
  appid: number;
  contextid: string;
  assetid: string;
  classid: string;
  instanceid: string;
  amount: string;
}

export interface InventoryDescription {
  appid: number;
  classid: string;
  instanceid: string;
  currency: number;
  background_color: string;
  icon_url: string;
  icon_url_large: string;
  descriptions?: DescriptionDescription[];
  tradable: number;
  actions: Action[];
  name: string;
  name_color: string;
  type: string;
  market_name: string;
  market_hash_name: string;
  commodity: number;
  market_tradable_restriction: number;
  market_marketable_restriction: number;
  marketable: number;
  tags: Tag[];
  market_actions?: Action[];
  fraudwarnings?: string[];
}

export interface Action {
  link: string;
  name: string;
}

export interface DescriptionDescription {
  value: string;
  color?: string;
}

export interface Tag {
  category: string;
  internal_name: string;
  localized_category_name: string;
  localized_tag_name: string;
  color?: string;
}
