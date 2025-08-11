import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

async function sleep(){
    //esta funcion simulara el proceso de llamada a un backend y en 5 segundos ya devuelve resolve
    return new Promise( resolve => {
        setTimeout(() => {
            resolve(true)
        }, 2500);
    });
}

export class FormUtils{

    //expresiones regulares
    //sirve para validar que ingresen nombre y apellido o apellido y nombre
    static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
    //sirve para validar email
    static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    //ingresar lo que sea pero sin espacios, sirve para el username y password
    static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
    //esta expresion solo permite letras a-z, numeros 0-9 y guiones bajo y normal
    static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';
    /*
        TODO: para el password se puede pedir a 
        chatGPT que nos de una expresion que pida 
        mayusculas, minusculas, numero y caracter especial
    */

    static isInvalidField(myForm: FormGroup, fieldName : string ): boolean | null {
        return (myForm.controls[fieldName].errors && myForm.controls[fieldName].touched);
    }

    static getFieldError(myForm: FormGroup, fieldName: string): string | null {
        if (!myForm.controls[fieldName]) return null;
        const errors = myForm.controls[fieldName].errors ?? {};
        return this.getTextError(errors);
    }

    static isValidFieldInArray(formArray: FormArray, index: number){
        return(
            formArray.controls[index].errors && formArray.controls[index].touched
        );
    }

    static getFieldEInArrayrror(formArray: FormArray, index: number): string | null {
        if (formArray.controls.length == 0) return null;
        const errors = formArray.controls[index].errors ?? {};
        return this.getTextError(errors);
    }

    static getTextError(errors: ValidationErrors){
        //console.log({errors});
        for (const key of Object.keys(errors)){
            switch (key){
            case 'required':
                return 'Este campo no puede quedar vacío';
            case 'userNameTaken':
                return 'El nombre de usuario ya esta en uso';
            case 'minlength':
                return `El campo debe tener un mínimo de ${errors['minlength'].requiredLength} caracteres`;
            case 'min':
                return `Valor mínimo de ${errors['min'].min}`;
            case 'email':
                return 'El formato del e-mail es incorrecto'
            case 'emailTaken':
                return 'El e-mail ya esta en uso'
            case 'pattern':
                if (errors['pattern'].requiredPattern == this.emailPattern){
                    return 'El formato del e-mail es incorrecto'
                }
                else if(errors['pattern'].requiredPattern == this.namePattern){
                    return 'El campo debe tener nombre y apellido'
                }
                else if(errors['pattern'].requiredPattern == this.notOnlySpacesPattern){
                    return 'El campo no debe tener espacios en blanco'
                }
                return 'El valor ingresado no cumple el formato establecido'
                break;
            case 'fieldsNotEqual':
                return 'Los campos no son iguales';
            default:
                return `Error de validación no controlado en ${key}`
            }
        }
        return null;
    }

    static fieldsEqual(f1: string, f2: string){
        return(formGroup: AbstractControl) => {
            const f1Val = formGroup.get(f1)?.value;
            const f2Val = formGroup.get(f2)?.value;

            return f1Val == f2Val ? null : { fieldsNotEqual: true };
        };
    }

    static checkUserName(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        return value == 'gabpsy' || value == 'lvasquez' ? {userNameTaken : true} : null;
        // return(formGroup: AbstractControl) => {
        //     const userNameVal = formGroup.get(userName)?.value;
        //     return userNameVal != 'gabpsy' ? null : {userNameTaken: true}
        // };
    }

    static async checkingExistingEmail(control: AbstractControl): Promise<ValidationErrors | null>{
        //metodo de prueba async
        await sleep();
        const formValue = control.value;
        if (formValue == 'hola@mundo.com'){
            return {
                emailTaken: true,
            };
        }
        return null;
    }

    static onSave(myForm: FormGroup){
        if (myForm.invalid){
            myForm.markAllAsTouched();
            return;
        }

        //console.log(myForm.value);

        //resetear y deja vacío
        //myForm.reset();

        //resetear asignando valores default
        myForm.reset({
            name: '',
            price: 0,
            stock: 0,
        });
    }


}
