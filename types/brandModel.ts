export interface BrandModel {
  br_name: string;
  br_parent: string | null;
  br_newname: string;
  br_cmp_id: string;
  it_br_name: string;
  selected: boolean | false;
}
