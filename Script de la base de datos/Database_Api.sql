CREATE DATABASE Data_Cyber;
USE Data_Cyber;

--Instructor
CREATE TABLE Instructor (
    IdInstructor INT PRIMARY KEY,
    Nombre_Instructor VARCHAR(20),
    Apellido_Instructor VARCHAR(20),
    Edad_Instructor INT,
    Telefono_Instructor VARCHAR(20)	
); 


--Curso
CREATE TABLE Curso (
    IdCurso INT PRIMARY KEY,
    Nombre_Curso VARCHAR(100),
    Costo DECIMAL(10,2),
    Duracion INT,
    Fecha_Inicial DATE DEFAULT GETDATE(),
    Fecha_Fin DATE,
);
--Imparte
CREATE TABLE Imparte(
    IdInstructor INT NOT NULL,
    IdCurso INT NOT NULL,
    Tematica VARCHAR(50),
    CONSTRAINT FK_Imparte_Instructor FOREIGN KEY (IdInstructor)
    REFERENCES Instructor(IdInstructor)
    ON DELETE CASCADE, 
    CONSTRAINT FK_Imparte_Curso FOREIGN KEY (IdCurso)
    REFERENCES Curso(IdCurso)
    ON DELETE CASCADE,
    CONSTRAINT PK_Instructor PRIMARY KEY (IdInstructor, IdCurso)
);
--Practicas empresariales
CREATE TABLE PracticasEmpresariales (
    IdPractica INT PRIMARY KEY,
    No_Horas INT,
    Fecha_Inicio DATETIME DEFAULT GETDATE(),
    Fecha_Final DATETIME DEFAULT GETDATE()  
);
--Alumno
CREATE TABLE Alumno (
    IdAlumno INT PRIMARY KEY,
    Nombre_Alumno VARCHAR(20),
    Apellido_Alumno VARCHAR(20),
    Edad_Alumno INT,
    Telefono_Alumno VARCHAR(20),
	Correo_Alumno VARCHAR(20),
	IdPractica INT,
	CONSTRAINT FK_Alumno_PracticasEmpresariales
	FOREIGN KEY (IdPractica) REFERENCES PracticasEmpresariales(IdPractica)
);
--Factura
CREATE TABLE Factura(
IdFactura INT PRIMARY KEY,
Estado VARCHAR(20),
Subtotal DECIMAL(10,2),
Total DECIMAL(10,2),
Fecha_Emision DATETIME DEFAULT GETDATE(),
IdAlumno INT
CONSTRAINT FK_Factura_Alumno
FOREIGN KEY (IdAlumno) REFERENCES Alumno(IdAlumno)
);
--Contiene
CREATE TABLE Contiene(
    IdCurso INT NOT NULL,
    IdFactura INT NOT NULL,
    Detalle VARCHAR(50),
    CONSTRAINT FK_Contiene_Curso FOREIGN KEY (IdCurso)
    REFERENCES Curso(IdCurso)
    ON DELETE CASCADE, 
    CONSTRAINT FK_Contiene_Factura FOREIGN KEY (IdFactura)
    REFERENCES Factura(IdFactura)
    ON DELETE CASCADE,
    CONSTRAINT PK_Curso PRIMARY KEY (IdCurso, IdFactura)
);
--::Procedimientos Almacenados::

--Instructor
-- Registrar Instructor
CREATE PROCEDURE Ins_Registrar(
    @IdInstructor INT,
    @Nombre_Instructor VARCHAR(20),
    @Apellido_Instructor VARCHAR(20),
    @Edad_Instructor INT,
    @Telefono_Instructor VARCHAR(20)
   
)
AS
BEGIN
    INSERT INTO Instructor VALUES (
        @IdInstructor,
        @Nombre_Instructor,
        @Apellido_Instructor,
        @Edad_Instructor,
        @Telefono_Instructor
      
    )
END
GO
-- Actualizar Instructor
CREATE PROCEDURE Ins_Actualizar(
    @IdInstructor INT,
    @Nombre_Instructor VARCHAR(20),
    @Apellido_Instructor VARCHAR(20),
    @Edad_Instructor INT,
    @Telefono_Instructor VARCHAR(20)
 
)
AS
BEGIN
    UPDATE Instructor SET
        Nombre_Instructor = @Nombre_Instructor,
        Apellido_Instructor = @Apellido_Instructor,
        Edad_Instructor = @Edad_Instructor,
        Telefono_Instructor = @Telefono_Instructor
    WHERE IdInstructor = @IdInstructor
END
GO
-- Eliminar Instructor
CREATE PROCEDURE Ins_Eliminar(
    @IdInstructor INT
)
AS
BEGIN
    DELETE FROM Instructor WHERE IdInstructor = @IdInstructor
END
GO
-- Obtener Instructor
CREATE PROCEDURE Ins_Obtener(
    @IdInstructor INT
)
AS
BEGIN
    SELECT * FROM Instructor WHERE IdInstructor = @IdInstructor
END
GO
-- Listar Instructores
CREATE PROCEDURE Ins_Listar
AS
BEGIN
    SELECT * FROM Instructor
END
GO



--procedimientos Curso
--Registrar Curso
CREATE PROCEDURE Curso_Registrar(
    @IdCurso INT,
    @Nombre_Curso VARCHAR(100),
    @Costo DECIMAL(10,2),
    @Duracion INT,
    @Fecha_Inicial DATE,
    @Fecha_Fin DATE
    )
AS
BEGIN
    INSERT INTO Curso(
        IdCurso,
        Nombre_Curso,
        Costo,
        Duracion,
        Fecha_Inicial,
        Fecha_Fin
    ) VALUES (
         @IdCurso,
         @Nombre_Curso,
         @Costo,
         @Duracion,
         @Fecha_Inicial,
         @Fecha_Fin
    )
END
GO
-- Actualizar Curso
CREATE PROCEDURE Curso_Actualizar(
    @IdCurso INT,
    @Nombre_Curso VARCHAR(100),
    @Costo DECIMAL(10,2),
    @Duracion INT,
    @Fecha_Inicial DATE,
    @Fecha_Fin DATE
)
AS
BEGIN
    UPDATE Curso  SET
        Nombre_Curso = @Nombre_Curso,
       Costo = @Costo,
        Duracion =  @Duracion,
        Fecha_Inicial = @Fecha_Inicial,
        Fecha_Fin = @Fecha_Fin
    WHERE IdCurso = @IdCurso
END
GO
-- Eliminar Curso
CREATE PROCEDURE Curso_Eliminar(
    @IdCurso INT
)
AS
BEGIN
    DELETE FROM Curso WHERE IdCurso = @IdCurso
END
GO
--Obtener Curso
CREATE PROCEDURE Curso_Obtener(
    @IdCurso INT
)
AS
BEGIN
    SELECT * FROM Curso WHERE IdCurso = @IdCurso
END
GO
-- Listar Curso
CREATE PROCEDURE Curso_Listar
AS
BEGIN
    SELECT * FROM Curso
END
GO

--procedimientos practicas
--Registrar Practica
CREATE PROCEDURE Pra_Registrar(
    @IdPractica INT,
    @No_Horas INT,
    @Fecha_Inicio DATETIME,
    @Fecha_Final DATETIME
    )
AS
BEGIN
    INSERT INTO PracticasEmpresariales(
        IdPractica,
        No_Horas,
        Fecha_Inicio,
        Fecha_Final
    ) VALUES (
         @IdPractica,
         @No_Horas,
         @Fecha_Inicio,
         @Fecha_Final
    )
END
GO
-- Actualizar Practica
CREATE PROCEDURE Pra_Actualizar(
    @IdPractica INT,
    @No_Horas INT,
    @Fecha_Inicio DATETIME,
    @Fecha_Final DATETIME
)
AS
BEGIN
    UPDATE PracticasEmpresariales  SET
        No_Horas = @No_Horas,
       Fecha_Inicio = Fecha_Inicio,
        Fecha_Final =  @Fecha_Final
        
        WHERE IdPractica = @IdPractica
END
GO
-- Eliminar Practica
CREATE PROCEDURE Pra_Eliminar
    @IdPractica INT
AS
BEGIN
    DELETE FROM PracticasEmpresariales
    WHERE IdPractica = @IdPractica;
END
GO

--Obtener Practica
CREATE PROCEDURE Pra_Obtener(
    @IdPractica INT
)
AS
BEGIN
    SELECT * FROM PracticasEmpresariales WHERE IdPractica = @IdPractica
END
GO
-- Listar Practica
CREATE PROCEDURE Pra_Listar
AS
BEGIN
    SELECT * FROM PracticasEmpresariales
END
GO

--procedimientos alumno
--Registrar Alumno
CREATE PROCEDURE Alu_Registrar(
    @IdAlumno INT,
    @Nombre_Alumno VARCHAR(20),
    @Apellido_Alumno VARCHAR(20),
    @Edad_Alumno INT,
    @Telefono_Alumno VARCHAR(20),
	@Correo_Alumno VARCHAR(20),
	@IdPractica INT
)
AS
BEGIN
    INSERT INTO Alumno(
    IdAlumno,
    Nombre_Alumno,
    Apellido_Alumno,
    Edad_Alumno ,
    Telefono_Alumno ,
	Correo_Alumno,
	IdPractica -- FK
    ) VALUES (
     @IdAlumno,
     @Nombre_Alumno,
     @Apellido_Alumno,
     @Edad_Alumno ,
     @Telefono_Alumno ,
	 @Correo_Alumno,
	 @IdPractica -- value FK
    )
END
GO
-- Actualizar Alumno
CREATE PROCEDURE Alu_Actualizar(
    @IdAlumno INT,
    @Nombre_Alumno VARCHAR(20),
    @Apellido_Alumno VARCHAR(20),
    @Edad_Alumno INT,
    @Telefono_Alumno VARCHAR(20),
	@Correo_Alumno VARCHAR(20),
	@IdPractica INT
)
AS
BEGIN
    UPDATE Alumno  SET
       
       Nombre_Alumno =  @Nombre_Alumno,
       Apellido_Alumno =  @Apellido_Alumno,
       Edad_Alumno  = @Edad_Alumno ,
        Telefono_Alumno = @Telefono_Alumno,
        Correo_Alumno = @Correo_Alumno,
        IdPractica = @IdPractica
        WHERE IdAlumno = @IdAlumno
END
GO
-- Eliminar Alumno
CREATE PROCEDURE Alu_Eliminar(
    @IdAlumno INT
)
AS
BEGIN
    DELETE FROM Alumno WHERE IdAlumno = @IdAlumno
END
GO
--Obtener Alumno
CREATE PROCEDURE Alu_Obtener(
    @IdAlumno INT
)
AS
BEGIN
    SELECT * FROM Alumno WHERE IdAlumno = @IdAlumno
END
GO
-- Listar Alumno
CREATE PROCEDURE Alu_Listar
AS
BEGIN
    SELECT * FROM Alumno
END
GO

--procedimientos Factura
--Registrar Factura
CREATE PROCEDURE Fac_Registrar(
    @IdFactura INT,
    @Estado VARCHAR(20),
    @Subtotal DECIMAL(10,2),
    @Total DECIMAL(10,2),
    @Fecha_Emision DATETIME,
	@IdAlumno INT
)
AS
BEGIN
    INSERT INTO Factura(
    IdFactura,
    Estado,
    Subtotal,
    Total ,
    Fecha_Emision  ,
	IdAlumno -- FK
    ) VALUES (
     @IdFactura,
     @Estado,
     @Subtotal,
     @Total ,
     @Fecha_Emision ,
	 @IdAlumno -- value FK
    )
END
GO
-- Actualizar Factura
CREATE PROCEDURE Fac_Actualizar(
   @IdFactura INT,
    @Estado VARCHAR(20),
    @Subtotal DECIMAL(10,2),
    @Total DECIMAL(10,2),
    @Fecha_Emision DATETIME,
	@IdAlumno INT
)
AS
BEGIN
    UPDATE Factura  SET
     
       Estado =  @Estado,
       Subtotal  = @Subtotal ,
       Total = @Total,
        Fecha_Emision = @Fecha_Emision,
        IdAlumno = @IdAlumno
        WHERE IdFactura = @IdFactura
END
GO
-- Eliminar Factura
CREATE PROCEDURE Fac_Eliminar(
    @IdFactura INT
)
AS
BEGIN
    DELETE FROM Factura WHERE IdFactura = @IdFactura
END
GO
--Obtener Factura
CREATE PROCEDURE Fac_Obtener(
    @IdFactura INT
)
AS
BEGIN
    SELECT * FROM Factura WHERE IdFactura = @IdFactura
END
GO
-- Listar Alumno
CREATE PROCEDURE Fac_Listar
AS
BEGIN
    SELECT * FROM Factura
END
GO

--Procedimientos imparte
-- Insertar relación Instructor-Curso
CREATE PROCEDURE Imp_Registrar
    @IdInstructor INT,
    @IdCurso INT,
    @Tematica VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Imparte WHERE IdInstructor = @IdInstructor AND IdCurso = @IdCurso)
    BEGIN
        RAISERROR('La relación Instructor-Curso ya existe', 16, 1);
        RETURN;
    END

    INSERT INTO Imparte (IdInstructor, IdCurso, Tematica)
    VALUES (@IdInstructor, @IdCurso, @Tematica);

    SELECT '✅ Relación registrada' AS Mensaje;
END
GO
-- Actualizar imparte
CREATE PROCEDURE Imp_Actualizar
    @IdInstructor INT,
    @IdCurso INT,
    @Tematica VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Imparte
    SET Tematica = @Tematica
    WHERE IdInstructor = @IdInstructor AND IdCurso = @IdCurso;

    IF @@ROWCOUNT = 0
        RAISERROR('No existe relación para actualizar', 16, 1);
    ELSE
        SELECT '✅ Relación actualizada' AS Mensaje;
END
GO
-- Eliminar imparte
CREATE PROCEDURE Imp_Eliminar
    @IdInstructor INT,
    @IdCurso INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Imparte
    WHERE IdInstructor = @IdInstructor AND IdCurso = @IdCurso;

    IF @@ROWCOUNT = 0
        RAISERROR('No existe relación para eliminar', 16, 1);
    ELSE
        SELECT '✅ Relación eliminada' AS Mensaje;
END
GO
-- Obtener imparte
CREATE PROCEDURE Imp_Obtener
    @IdInstructor INT,
    @IdCurso INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT IdInstructor, IdCurso, Tematica
    FROM Imparte
    WHERE IdInstructor = @IdInstructor AND IdCurso = @IdCurso;
END
GO
-- Listar todas
CREATE PROCEDURE Imp_Listar
AS
BEGIN
    SET NOCOUNT ON;

    SELECT IdInstructor, IdCurso, Tematica
    FROM Imparte;
END
GO

--Procedimientos Contiene
-- registrar contiene
CREATE PROCEDURE Cont_Registrar
    @IdCurso INT,
    @IdFactura INT,
    @Detalle VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Contiene WHERE IdCurso = @IdCurso AND IdFactura = @IdFactura)
    BEGIN
        RAISERROR('La relación Curso-Factura ya existe', 16, 1);
        RETURN;
    END

    INSERT INTO Contiene (IdCurso, IdFactura, Detalle)
    VALUES (@IdCurso, @IdFactura, @Detalle);

    SELECT '✅ Relación registrada' AS Mensaje;
END
GO
-- Actualizar Contiene
CREATE PROCEDURE Cont_Actualizar
   @IdCurso INT,
    @IdFactura INT,
    @Detalle VARCHAR(50) 
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Contiene
    SET Detalle = @Detalle
    WHERE IdCurso = @IdCurso AND IdFactura = @IdFactura;

    IF @@ROWCOUNT = 0
        RAISERROR('No existe relación para actualizar', 16, 1);
    ELSE
        SELECT '✅ Relación actualizada' AS Mensaje;
END
GO
-- Eliminar Contiene
CREATE PROCEDURE Cont_Eliminar
    @IdCurso INT,
    @IdFactura INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Contiene
    WHERE IdCurso = @IdCurso AND IdFactura = @IdFactura;

    IF @@ROWCOUNT = 0
        RAISERROR('No existe relación para eliminar', 16, 1);
    ELSE
        SELECT '✅ Relación eliminada' AS Mensaje;
END
GO
-- Obtener Contiene
CREATE PROCEDURE Cont_Obtener
    @IdCurso INT,
    @IdFactura INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT IdCurso, IdFactura,Detalle 
    FROM Contiene
    WHERE IdCurso = @IdCurso AND IdFactura = @IdFactura;
END
GO
-- Listar todas
CREATE PROCEDURE Cont_Listar
AS
BEGIN
    SET NOCOUNT ON;

   SELECT IdCurso, IdFactura,Detalle 
    FROM Contiene;
END
GO
