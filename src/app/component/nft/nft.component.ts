import {Component, OnInit } from '@angular/core';
import { NFTService } from '../../nft.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrl: './nft.component.css'
})


export class NftComponent implements OnInit{
  tipovendita!:string;
  vuoivendere: boolean = false;
  nftmodel!: any;
  imageUrl: any;

  fineasta! : string;
  price! : number;
  wallet!: string;
  wallets: string[] = ['USD', 'ETH'];
  selectedWallet!: string;
  sellerAddress: any;
  alladdress: any[]= [];

  constructor(private nftservice: NFTService, private auth: AuthService, private route: Router){}


  ngOnInit(): void {
    this.nftservice.getdbnft(this.nftservice.getnftid() ?? '').subscribe(data =>{
      this.nftmodel= data;
      this.image();
    })

  }

    image() {
      const id = this.nftservice.getnftid() ?? '';

      this.nftservice.getImage(id).subscribe(
        (data: ArrayBuffer) => {
          const uint8Array = new Uint8Array(data);
          const byteCharacters = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
          const imageUrl = 'data:image/png;base64,' + btoa(byteCharacters);
          this.imageUrl = imageUrl;
        },
        (error) => {
          console.error('Errore durante il recupero dell\'immagine', error);
        }
      );
    }
    mettiinvendita(){
      this.vuoivendere= this.vuoivendere ? false : true;
    }


    convertStringToSeconds(timeString: string): number {
      const timeArray = timeString.split(':');

      if (timeArray.length !== 3) {
        throw new Error('Formato della stringa di tempo non valido. Utilizza il formato HH:mm:ss');
      }

      const hours = parseInt(timeArray[0], 10);
      const minutes = parseInt(timeArray[1], 10);
      const seconds = parseInt(timeArray[2], 10);

      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        throw new Error('Formato della stringa di tempo non valido. Assicurati che ore, minuti e secondi siano numeri.');
      }

      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      return totalSeconds;
    }

    vendi() {
      let idNft = this.nftservice.getnftid();
      let price = this.price;
      let duration = 0;
      if(this.fineasta!=null){duration = this.convertStringToSeconds(this.fineasta);}
      this.auth.getwallet().subscribe((data: any[]) => {
        this.alladdress = data;
        if(this.selectedWallet === 'USD'){
          for (let el of this.alladdress){
            if(el.type==1){
              this.sellerAddress = el.address;
            }
          }
        }
        if(this.selectedWallet === 'ETH'){
          for (let el of this.alladdress){
            if(el.type==0){
              this.sellerAddress = el.address;
            }
          }
        }
        this.nftservice.addSale({idNft,price, sellerAddress: this.sellerAddress, duration })
      });

        
      this.route.navigate(['home']);
    }

    }
