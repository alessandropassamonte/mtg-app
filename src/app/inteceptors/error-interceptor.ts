import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  mapErrors: Map<number, string> = new Map([
    [500, 'Errore dovuto al server'],
    [503, 'Il server non è al momento in grado di gestire la richiesta a causa di un sovraccarico temporaneo o di una manutenzione']
  ])
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler){ 

    return next.handle(request)
  }



}
