package orm

import "gorm.io/gorm"

type Userlgs struct {
	gorm.Model
	Username string
	Password string
	Fullname string
	Avatar   string
}
