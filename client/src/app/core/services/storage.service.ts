import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage?: Storage;

  constructor(private str: Storage) {
    this.init();
  }

  async init() {
    this.storage = await this.str.create();
  }

  async set(key: string, value: string) {
    await this.storage?.set(key, value);
  }

  async get(key: string) {
    await this.storage?.get(key);
  }

  async remove(key: string) {
    await this.storage?.remove(key);
  }

  async clearAll() {
    await this.storage?.clear();
  }

  // To enumerate the stored key/value pairs:
  // storage.forEach((key, value, index) => {
  // });
}
