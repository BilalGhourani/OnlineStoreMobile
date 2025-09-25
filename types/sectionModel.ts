import {ItemModel} from './itemModel'

export interface SectionModel {
 fa_name: string;
  fa_parent: string;
  fa_group: string;
  fa_newname: string;
  fa_cmp_id: string;

  items: ItemModel[];
}