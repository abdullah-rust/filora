export interface FileItem {
  name: string;
  id: number;
  is_folder: boolean;
  size?: string;
  mime_type?: string;
  uuid: string;
  created_at?: string;
  is_public: boolean;
}

export interface FileListObject {
  [key: string]: FileItem;
}

export interface AlertData {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}
