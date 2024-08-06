import { Component, Input, OnInit } from '@angular/core';
import { EstadosBalizaDataminer } from '../../enums/estados.enum';
import { BreadCrumbService } from '../../services/bread-crumb.service';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.less'],
})
export class BreadCrumbComponent implements OnInit {
  rutas = [''];
  estado!: string;
  estadosList = EstadosBalizaDataminer;

  constructor(private _breadrumbService: BreadCrumbService) {}

  ngOnInit(): void {
    this.llenarRutas();
  }
  llenarRutas() {
    this._breadrumbService.estado$.subscribe((result) => {
      this.estado = result;
    });
    this._breadrumbService.updateBreadCrumb.subscribe((data) => {
      if (data.valor == 'mapa') {
        this.rutas = ['General'];
      }
      if (data.valor == 'usurioUsuario') {
        this.rutas = ['Gestión de Usuarios'];
      }
      if (data.valor == 'unid') {
        this.rutas = ['Gestión de Unidades'];
      }
      if (
        data.valor == 'configiracionSistema' ||
        data.valor == 'altaBalizas' ||
        data.valor == 'nomencladores' ||
        data.valor == 'audit'
      ) {
        this.rutas = ['Configuración de Avanzada'];
      }

      //establecer padrees
      let arbol = [
        // { id: 'home', padre: '' , descripcion : 'home', posicion: 0 },
        //Pantalla mapa
        { id: 'mapa', padre: 'home', descripcion: 'mapa', posicion: 1 },
        {
          id: 'informacion',
          padre: 'home',
          descripcion: 'balizas',
          posicion: 1,
        },
        {
          id: 'configAvanzada',
          padre: 'informacion',
          descripcion: 'Config avanzada',
          posicion: 2,
        },
        {
          id: 'infoDispositivo',
          padre: 'informacion',
          descripcion: 'Info de dispositivo',
          posicion: 2,
        },
        {
          id: 'instalacion',
          padre: 'informacion',
          descripcion: 'Instalación',
          posicion: 2,
        },
        {
          id: 'ultimaPosicion',
          padre: 'informacion',
          descripcion: 'Última posición',
          posicion: 2,
        },
        {
          id: 'configGPS',
          padre: 'informacion',
          descripcion: 'Config GPS',
          posicion: 2,
        },
        {
          id: 'configAntiBarridoa',
          padre: 'informacion',
          descripcion: 'Config anti-barrido',
          posicion: 2,
        },
        {
          id: 'planificador',
          padre: 'informacion',
          descripcion: 'Planificador',
          posicion: 2,
        },
        {
          id: 'nuevoPlanificador',
          padre: 'informacion',
          descripcion: 'Nuevo Planificador',
          posicion: 2,
        },
        {
          id: 'geofences',
          padre: 'informacion',
          descripcion: 'Geofences',
          posicion: 2,
        },
        {
          id: 'alertasOperativo',
          padre: 'informacion',
          descripcion: 'Alertas operativo',
          posicion: 2,
        },

        //Pantalla usuarios
        {
          id: 'usurioUsuario',
          padre: 'home',
          descripcion: 'usuario',
          posicion: 1,
        },
        {
          id: 'usurioUnidad',
          padre: 'usurioUsuario',
          descripcion: 'unidad',
          posicion: 2,
        },
        //Pantalla unidades
        { id: 'unid', padre: 'home', descripcion: 'unidad', posicion: 1 },
        { id: 'usua', padre: 'unid', descripcion: 'usuario', posicion: 2 },
        { id: 'oper', padre: 'unid', descripcion: 'operacion', posicion: 2 },
        { id: 'bali', padre: 'bali', descripcion: 'baliza', posicion: 2 },
        { id: 'obje', padre: 'oper', descripcion: 'objetivo', posicion: 3 },
        { id: 'perm', padre: 'perm', descripcion: 'permiso', posicion: 3 },
        { id: 'hist', padre: 'hist', descripcion: 'histórico', posicion: 4 },
        { id: 'inform', padre: 'inform', descripcion: 'informe', posicion: 5 },
        //Pantalla configuracion de sistema
        {
          id: 'configiracionSistema',
          padre: 'home',
          descripcion: 'Configuracion sistema',
          posicion: 1,
        },
        {
          id: 'servidores',
          padre: 'configiracionSistema',
          descripcion: 'Servidores',
          posicion: 2,
        },
        {
          id: 'tiposBaliza',
          padre: 'configiracionSistema',
          descripcion: 'Tipos de balizas',
          posicion: 2,
        },
        {
          id: 'listadoJuzgados',
          padre: 'configiracionSistema',
          descripcion: 'Listado de Juzgados',
          posicion: 2,
        },
        //Pantalla Alta de balizas
        {
          id: 'altaBalizas',
          padre: 'home',
          descripcion: 'Alta de balizas',
          posicion: 1,
        },
        {
          id: 'stocks',
          padre: 'altaBalizas',
          descripcion: 'Stock',
          posicion: 2,
        },
        {
          id: 'asignadas',
          padre: 'altaBalizas',
          descripcion: 'Asignadas',
          posicion: 2,
        },
        //Pantalla de Nomencladores
        {
          id: 'nomencladores',
          padre: 'home',
          descripcion: 'Nomencladores',
          posicion: 1,
        },
        // Auditoria
        { id: 'audit', padre: 'home', descripcion: 'auditoria', posicion: 1 },
      ];

      let tabEnArbol = arbol.find((item) => item.id == data.valor);
      if (
        data.valor == 'perm' &&
        this.rutas[this.rutas.length - 1].length > 10
      ) {
        this.rutas = this.rutas.slice(0, 4);
      } else {
        this.rutas = this.rutas.slice(0, tabEnArbol!.posicion);
      }
      this.rutas.push(tabEnArbol!.descripcion);

      if (data.seleccionado) {
        this.addRutasIdSelected(data.seleccionado);
      }
    });
  }
  addRutasIdSelected(select: string) {
    let ultimaRuta = this.rutas[this.rutas.length - 1];
    let newEndPath = `${ultimaRuta} # ${select}`;
    this.rutas.pop();
    this.rutas.push(newEndPath);
  }
}
