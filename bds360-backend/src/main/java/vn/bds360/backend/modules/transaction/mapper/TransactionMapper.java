package vn.bds360.backend.modules.transaction.mapper;

import org.mapstruct.Mapper;

import vn.bds360.backend.common.mapper.MapperConfiguration;
import vn.bds360.backend.modules.transaction.dto.response.TransactionResponse;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.user.mapper.UserMapper;

@Mapper(config = MapperConfiguration.class, uses = { UserMapper.class })
public interface TransactionMapper {

    TransactionResponse toTransactionResponse(Transaction transaction);

}